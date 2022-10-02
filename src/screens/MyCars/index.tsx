import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons'

import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { Car } from '../../components/Car'
import {LoadinAnimation} from '../../components/LoadinAnimation';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';


interface CarProps{
  car: CarDTO;
  id: string;
  user_id: string;
  startDate:string;
  endDate:string;
}

export function MyCars(){
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const theme = useTheme();

  useEffect(() =>{
    async function fetchCars(){
      try {
        const response = await api.get('/schedules_byuser?user_id=1');
        setCars(response.data);
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false);
      }
    }
    fetchCars();
  },[])

  function handleBack(){
    navigation.goBack()
  }
  return (
    <Container>
       <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
       <Header>
          <BackButton 
            onPress={handleBack}
            color={theme.colors.shapes}
            />
            <Title>
                Escolha uma data de início e
                fim do aluguel    
            </Title>
            <SubTitle>
              Conforto, segurança e praticidade
            </SubTitle>
       </Header>

        {loading ? <LoadinAnimation/> :
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <FlatList
            data={cars}
            keyExtractor={item=>item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
            <CarWrapper>
              <Car data={item.car}/>
              <CarFooter>
                <CarFooterTitle>Período</CarFooterTitle>
                <CarFooterPeriod>
                  <CarFooterDate>{item.startDate}</CarFooterDate>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    color={theme.colors.title}
                    style={{marginHorizontal:10}}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                </CarFooterPeriod>
              </CarFooter>
            </CarWrapper>
            )}
          />
        </Content>
      }

    </Container>
  );
}