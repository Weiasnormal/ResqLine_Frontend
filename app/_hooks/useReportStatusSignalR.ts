import { useEffect, useMemo } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../_api/config';
import { mapStatusToString } from '../_api/reports';

const getStatusRank = (status: any): number => {
    const label = mapStatusToString(status);
    switch (label) {
        case 'Under Review': return 1;
        case 'Dispatched':
        case 'In Progress': return 2;
        case 'Resolved': return 3;
        case 'Rejected': return 2;
        default: return 0;
    }
};

/**
 * Subscribes to backend report status changes via SignalR and invalidates
 * React Query caches so card badges + report details refresh in real-time.
 *
 * Expected hub event name: "ReportStatusChanged"
 * Expected payload shape (best-effort): { reportId: string, newStatus?: string, ... }
 *
 * Backend URL is read from:
 *  - EXPO_PUBLIC_SIGNALR_HUB_URL
 * with a safe placeholder fallback to API_BASE_URL.
 */
export const useReportStatusSignalR = (reportId?: string) => {
  const queryClient = useQueryClient();

  const hubUrl = useMemo(() => {
    let url = process.env.EXPO_PUBLIC_SIGNALR_HUB_URL || `${API_BASE_URL}/hub/Notification`;
    // Clean up any accidental surrounding quotes from the .env file parsing
    url = url.replace(/^['"](.*)['"]$/, '$1');
    
    // SignalR's HubConnectionBuilder expects http/https URLs and handles the wss upgrade internally.
    // If a wss:// or ws:// URL is provided, we must convert it to https:// or http:// respectively.
    if (url.startsWith('wss://')) {
      url = url.replace('wss://', 'https://');
    } else if (url.startsWith('ws://')) {
      url = url.replace('ws://', 'http://');
    }
    
    return url;
  }, []);

  useEffect(() => {
    if (!hubUrl) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const handler = (eventData: any) => {
      // We intentionally invalidate all report-related queries.
      // This ensures: ReportCard badges + ViewDetails status badges update.
      try {
        const changedReportId = eventData?.reportId ?? eventData?.ReportId ?? eventData?.id;
        const newStatus = eventData?.status ?? eventData?.Status;
        
        // Track the timestamp of the status change for the View_Details timeline globally
        if (changedReportId && newStatus !== undefined) {
          // Immediately update the React Query cache for the specific report to make UI react instantly (e.g. View Details timeline)
          queryClient.setQueryData(['reports', 'detail', String(changedReportId)], (oldData: any) => {
            if (!oldData || !oldData.data) return oldData;
            return { 
              ...oldData, 
              data: { ...oldData.data, status: newStatus } 
            };
          });
          
          // Also immediately update any active lists (Home, Recent Reports, Status Filtered)
          queryClient.setQueriesData({ queryKey: ['reports'] }, (oldData: any) => {
            if (!oldData || !Array.isArray(oldData.data)) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((report: any) => 
                String(report.id) === String(changedReportId) 
                  ? { ...report, status: newStatus } 
                  : report
              )
            };
          });

          const rank = getStatusRank(newStatus);
          if (rank > 0) {
            const key = `report_timeline_${changedReportId}`;
            SecureStore.getItemAsync(key).then(res => {
              const offsets = res ? JSON.parse(res) : {};
              if (!offsets[rank]) {
                  let updated = false;
                  // Set timestamp for this status
                  // Also fill earlier states just to be safe
                  for (let r = 1; r <= rank; r++) {
                      if (!offsets[r]) {
                          offsets[r] = Date.now();
                          updated = true;
                      }
                  }
                  if (updated) {
                      SecureStore.setItemAsync(key, JSON.stringify(offsets)).catch(() => {});
                  }
              }
            }).catch(() => {});
          }
        }

        if (reportId && changedReportId != null && String(changedReportId) !== String(reportId)) {
          // Still invalidate because lists/screens might be showing different report IDs,
          // and the status change may affect filtered views.
        }
      } catch {
        // Ignore parsing issues
      }

      // Delay the invalidation by 2.5 seconds to ensure the backend database
      // transaction has fully committed before we refetch. Otherwise, the frontend
      // fetches stale data immediately and overwrites our fresh SignalR cache.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['reports'], exact: false });
      }, 2500);
    };

    connection.on('ReportStatusChanged', handler);

    connection
      .start()
      .then(() => {
        // If your backend supports grouping by reportId, you can opt-in here.
        // If not supported, the promise will reject and we ignore it.
        if (reportId) {
          connection.invoke('JoinReportGroup', reportId).catch(() => undefined);
        }
      })
      .catch((err) => {
        console.warn('SignalR connection error:', err);
      });

    return () => {
      try {
        connection.off('ReportStatusChanged', handler);
        connection.stop().catch(() => undefined);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [hubUrl, queryClient, reportId]);
};

