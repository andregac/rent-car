import React, {useState} from 'react';
import {useTheme} from 'styled-components'
import {Feather} from '@expo/vector-icons'
import { TextInputProps } from 'react-native';

import { BorderlessButton } from 'react-native-gesture-handler';
import {
  Container,
  IconContainer,
  InputText,
} from './styles';


interface Props extends TextInputProps{
    iconName: React.ComponentProps<typeof Feather>['name']
    value?:string;
}
export function InputPassword({
    iconName,
    value,
    ...rest
}: Props){
    const [isPasswordVisible,setIsPasswordVisible] = useState(true)
    const theme = useTheme()
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    function handleInputFocus(){
      setIsFocused(true)
    }

    function handleInputBlue(){
     setIsFocused(false)
     setIsFilled(!!value)
    }
    function handlePasswordVisibilityChange(){
      setIsPasswordVisible(prevState => !prevState)
    }
  return (
    <Container >
        <IconContainer isFocused={isFocused}>
        <Feather
            name={iconName}
            size={24}
            color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
        />
        </IconContainer>

        <InputText  
        isFocused={isFocused}
        secureTextEntry={isPasswordVisible}
        onBlur={handleInputBlue}
        onFocus={handleInputFocus}
        {...rest}
        
        />

        <BorderlessButton onPress={handlePasswordVisibilityChange}>
        <IconContainer  isFocused={isFocused}>
          <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={theme.colors.text_detail}
              
              />
          </IconContainer>
            </BorderlessButton>
    </Container>
  );
}