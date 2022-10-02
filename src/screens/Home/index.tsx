import React, {useEffect, useState} from 'react';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import {LoadinAnimation} from '../../components/LoadinAnimation';
import {api}  from '../../services/api';
import {CarDTO} from '../../dtos/CarDTO';

import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';

export function Home(){
const [cars, setCars] = useState<CarDTO[]>([]);
const [loading, setLoading] = useState(true);

const navigation = useNavigation<NavigationProp<ParamListBase>>();

function handleCarDetail(car: CarDTO) {
  navigation.navigate('CarDetails', {car})
}

useEffect(()=> {
async function fethCars(){
 try {
  const response = await api.get('/cars')
  setCars(response.data)
 } catch (error) {
  console.log(error);
 }finally{
  setLoading(false)
 }
}
fethCars();
}, []);

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
        <Header>
          <HeaderContent>
              <Logo
                width={RFValue(108)}
                height={RFValue(12)}
              />
             { !loading &&
                <TotalCars>
                  Total de {cars.length} carros
                </TotalCars>
              }
          </HeaderContent>    
        </Header>
          
          {loading ? <LoadinAnimation/> : 
          <CarList
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({item}) => 
            <Car data={item} onPress={() => handleCarDetail(item)}/>}
          />
        }
    </Container>
  );
}