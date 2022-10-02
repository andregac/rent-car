import React, { useState } from 'react';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Alert,
  } from 'react-native';
import * as Yup from 'yup';

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
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export function StepOne(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [cnh,setCnh] = useState('');

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  function handleBack(){
    navigation.goBack();
  }

  async function handleNextStep(){
   try {
    const schema = Yup.object().shape({
      cnh:Yup.string().required('CNH é obrigatório'),
      email:Yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
      name:Yup.string().required('Nome é obrigatório')
     

    });
    const data = {name, email, cnh}
    await schema.validate(data)
    navigation.navigate('StepTwo', {user:data})
   } catch (error) {
    if(error instanceof Yup.ValidationError){
      return Alert.alert('Opa', error.message)
    }
   }
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
        <Container>
          <Header>
            <BackButton onPress={handleBack}/>
            <Steps>
              <Bullet active/>
              <Bullet/>
            </Steps>
          </Header>

          <Title>
            Crie sua {'\n'} conta
          </Title>
          <Subtitle>
            Faça seu cadastro de {'\n'} forma rápida e fácil
          </Subtitle>

          <Form> 
            <FormTitle>1. Dados</FormTitle>
              <Input
                iconName='user' 
                placeholder='Nome'
                onChangeText={setName}
                value={name}
              />

              <Input
                iconName='mail' 
                placeholder='E-mail'
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}

              />

              <Input
                iconName='credit-card' 
                placeholder='CNH'
                keyboardType="numeric"
                onChangeText={setCnh}
                value={cnh}
              />
          </Form>

          <Button
            title='Proximo'
            onPress={handleNextStep}
          />
        </Container>
    </KeyboardAvoidingView>
  );
}