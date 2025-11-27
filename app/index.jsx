import React, { useState } from 'react'
import ReportScreen from './screens/ReportScreen'
import SOSScreen from './screens/SOSScreen'
import HotlineScreen from './screens/HotlineScreen'
import HomeScreen from './screens/HomeScreen'

const Home = () => {
  const [activeTab, setActiveTab] = useState('home')

  const handleTabPress = (tab) => {
    setActiveTab(tab)
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'sos':
        return <SOSScreen onTabPress={handleTabPress} />
      case 'hotline':
        return <HotlineScreen onTabPress={handleTabPress} />
      case 'report':
        return <ReportScreen onTabPress={handleTabPress} />
      case 'home':
      default:
        return <HomeScreen onTabPress={handleTabPress} />
    }
  }

  return renderScreen()
}

export default Home