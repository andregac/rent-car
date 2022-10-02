import React, { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';

import { format, parseISO } from 'date-fns';
import {Feather} from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import {ImageSlider} from '../../components/ImageSlider';
import {Accessory} from '../../components/Accessory';
import {Button} from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import {getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { api } from '../../services/api';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal
} from './styles';

interface Params{
  car: CarDTO,
  dates: string[]
}

interface RentalPeriod{
  start:string;
  end:string;
}

export function SchedulingDetails(){
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute();
  const {car, dates} = route.params as Params;

  const rentTotal = Number(dates.length * car.price)

  async function handleConfirm(){
    setLoading(true)
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates,
    ];

    await api.post('rentals',{
      user_id: 1,
      car,
      start_date: format(parseISO(dates[0]), 'dd/MM/yyyy'),
      end_date: format(parseISO(dates[dates.length - 1]), 'dd/MM/yyyy'),
    })

    .then(() => navigation.navigate('Confirmation',{
      nextScreenRoute:'Home',
      title:'Carro Alugado!',
      message:`Agora você só precisa ir \n até a concessionária da RENTX\npegar o seu automóvel`
    }))
    .catch(() => {
      setLoading(false)
      Alert.alert('Estamos com problemas')
    })
    

}

  function handleBack(){
    navigation.goBack()
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(parseISO(dates[0]), 'dd/MM/yyyy'),
      end: format(parseISO(dates[dates.length - 1]), 'dd/MM/yyyy'),

    })
    
  }, [])
  return (
    <Container>
       <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
      />
        <Header>
            <BackButton
              onPress={handleBack}/>
        </Header>

        <CarImages>
          <ImageSlider imagesUrl={car.photos}
          />
        </CarImages>

        <Content>
          <Details>
            <Description>
              <Brand>{car.brand}</Brand>
              <Name>{car.name}</Name>
            </Description>

            <Rent>
              <Period>{car.period}</Period>
              <Price>R$ {car.price}</Price>
            </Rent>
          </Details>

          <Accessories>
            {
              car.accessories.map(accessory =>(
                <Accessory 
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
                />
              ))
           
            }
        
          </Accessories>

          <RentalPeriod>
            <CalendarIcon>
              <Feather
                name='calendar'
                size={RFValue(24)}
                color={theme.colors.shapes}

              />
            </CalendarIcon>

            <DateInfo>
              <DateTitle>DE</DateTitle>
              <DateValue>{rentalPeriod.start}</DateValue>
            </DateInfo>

            <Feather
                name='chevron-right'
                size={RFValue(10)}
                color={theme.colors.text}

              />

            <DateInfo>
              <DateTitle>ATÉ</DateTitle>
              <DateValue>{rentalPeriod.end}</DateValue>
            </DateInfo>
          </RentalPeriod>

          <RentalPrice>
            <RentalPriceLabel>Total</RentalPriceLabel>
            <RentalPriceDetails>
              <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
              <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
            </RentalPriceDetails>
          </RentalPrice>
        </Content>

        <Footer>
          <Button 
          color={theme.colors.sucess} 
          onPress={handleConfirm} 
          title ="Alugar Agora"
          enabled={!loading}
          loading={loading}
          />
  
        </Footer>
       
    </Container>
  );
}