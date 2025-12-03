import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: any;
  focusColor?: string; // border color when focused
  labelFocusColor?: string; // label color when focused
  baseBorderColor?: string;
  baseLabelColor?: string;
  assistiveText?: string; // optional assistive/error text shown below the field
}

const InlineTextField: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  containerStyle,
  focusColor = '#191716',
  labelFocusColor,
  baseBorderColor = '#E5E5E5',
  baseLabelColor = '#999',
  assistiveText,
  onBlur,     // destructure so we can call parent callback
  onFocus,    // destructure so we can call parent callback
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;

  const borderColor = focused ? focusColor : baseBorderColor;
  const lblColor = focused ? (labelFocusColor ?? focusColor) : baseLabelColor;

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    if (typeof onFocus === 'function') onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    if (typeof onBlur === 'function') onBlur(e);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.inputWrapper, { borderColor }]}>
        <Text style={[styles.label, floating ? styles.labelFloating : styles.labelBase, { color: lblColor }]}>
          {label}
        </Text>

        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholder=""
        />
      </View>

      {assistiveText ? (
        <Text style={styles.assistiveText} accessibilityRole="alert">
          {assistiveText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 15,
    position: 'relative',
    backgroundColor: '#fff',
  },
  label: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
  },
  labelBase: {
    top: 18,
    fontSize: 14,
  },
  labelFloating: {
    top: -8,
    fontSize: 12,
    fontFamily: 'OpenSans_600SemiBold',
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#191716',
    padding: 0,
    margin: 0,
    fontFamily: 'OpenSans_400Regular',
    textTransform: 'none',
  },
  assistiveText: {
    color: '#FF3E48',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'OpenSans_400Regular',
  },
});

export default InlineTextField;