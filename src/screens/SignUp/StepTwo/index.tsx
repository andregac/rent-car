import React, { useState } from 'react';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import {api} from '../../../services/api'
import {
  KeyboardAvoidingView,
  Alert,
  } from 'react-native';

import {
  Container,
  Header,
  Steps,
  Title,
  Subtitle,
  Form,
  FormTitle
} from './styles';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { InputPassword } from '../../../components/InputPassword';
import { Button } from '../../../components/Button';


interface Params{
  user:{
    name: string;
    email:string;
    cnh:string
  }
}

export function StepTwo(){
  const [password,setPassword] = useState('');
  const [passwordConfirm,setPasswordConfirm] = useState('')

  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute()
  const theme = useTheme()
  

  const {user} = route.params as Params;

  function handleBack(){
    navigation.goBack();
  }

  async function handlerRegister(){
    if(!password || !passwordConfirm){
      return Alert.alert('Informe a senha e a confirmação')
    }
    if(password != passwordConfirm){
      return Alert.alert('As senhas não são iguais')
    }

    await api.post('/users',{
      name:user.name,
      email:user.email,
      driver_license:user.cnh,
      password
    })
    .then(()=>{
      navigation.navigate('Confirmation',{
        nextScreenRoute:'SignIn',
        title:'Conta Criada!',
        message:`Agora é só fazer o login e \n aproveitar`
    })
  })
  .catch(() => {
    Alert.alert('Opa', 'Não foi possivel fazer o cadastro')
  });
}
  return (
    <KeyboardAvoidingView behavior='position' enabled>
        <Container>
          <Header>
            <BackButton onPress={handleBack}/>
            <Steps>
              <Bullet active/>
              <Bullet active/>
            </Steps>
          </Header>

          <Title>
            Crie sua {'\n'} conta
          </Title>
          <Subtitle>
            Faça seu cadastro de {'\n'} forma rápida e fácil
          </Subtitle>

          <Form> 
            <FormTitle>2. Senha</FormTitle>
            <InputPassword
            iconName='lock'
            placeholder='Senha'
            onChangeText={setPassword}
            value={password}
            />

            <InputPassword
            iconName='lock'
            placeholder='Repetir Senha'
            onChangeText={setPasswordConfirm}
            value={passwordConfirm}
            />
          </Form>

          <Button
          color={theme.colors.sucess}
          title='Cadastrar'
          onPress={handlerRegister}
          />
        </Container>
    </KeyboardAvoidingView>
  );
}