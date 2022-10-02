
import React, {useState} from 'react';
import {
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  } from 'react-native';
import * as Yup from 'yup';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import {Button} from '../../components/Button'
import { Input } from '../../components/Input';
import { InputPassword } from '../../components/InputPassword';
import theme from '../../global/styles/theme';
import {useAuth} from '../../hooks/auth'
import {
  Container,
  Header,
  Title,
  Form,
  SubTitle,
  Footer
} from './styles';

export function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {signIn} = useAuth();

  async function handleSignIn(){
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
        .required('E-mail é obrigatório')
        .email('Digite um e-mail válido'),
        password: Yup.string()
        .required('A senha é obrigatória')
      });
        await schema.validate({email,password})

        signIn({email,password})
    }catch (error) {
        if(error instanceof Yup.ValidationError){
           Alert.alert('Opa', error.message);
        }else{
          Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login, verifique as credenciais');
        }
    }
  }

  function handleSignUp(){
    navigation.navigate('StepOne')
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>Estamos{'\n'}quase lá.</Title>
            <SubTitle>
              Faça seu login para começar{'\n'}
              uma experiência incrível
            </SubTitle>
          </Header>

          <Form>
            <Input
              iconName={'mail'}
              placeholder='E-mail'
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={setEmail}
              value={email}
            />

            <InputPassword
              iconName={'lock'}
              placeholder='Senha'
              onChangeText={setPassword}
              value={password}
            />
          </Form>
          
          <Footer>
            <Button
              title="Login"
              onPress={handleSignIn}
              enabled={true}
              loading={false}
            />
            <Button
              color= {theme.colors.background_secondary}
              light={true}
              title="Criar conta gratuita"
              onPress={handleSignUp}
              enabled={true}
              loading={false}

            />
          </Footer>
        </Container>
    </KeyboardAvoidingView>
  );
}