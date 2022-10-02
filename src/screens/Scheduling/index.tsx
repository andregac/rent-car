import React, { useState } from 'react';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar, Alert } from 'react-native';
import {useTheme} from 'styled-components';
import { format, parseISO } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import { Calendar, DayProps, generateInterval, MarkedDateProps} from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';


interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params{
  car: CarDTO
}

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDate, setMarkedDate] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const route = useRoute();
  const {car} = route.params as Params;

  const navigation = useNavigation<NavigationProp<ParamListBase>>()
  const theme = useTheme()

  function handleConfirmRental(){
    if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted){
      Alert.alert('Selecione o intervalo que deseja alugar')
    }else{
      navigation.navigate('SchedulingDetails', {
        car,
        dates: Object.keys(markedDate)
      })
    }
    
  }

  function handleBack(){
    navigation.goBack()
  }

  function handleChangeDate(date: DayProps){
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval (start, end);
    setMarkedDate(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length -1];

    setRentalPeriod({ 
      startFormatted: format(parseISO(firstDate), 'dd/MM/yyyy'),
      endFormatted: format(parseISO(endDate), 'dd/MM/yyyy'),
    })
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

            <RentalPeriod>
                <DateInfo>
                    <DateTitle>DE</DateTitle>
                    <DateValue selected={!!rentalPeriod.startFormatted}>
                    {rentalPeriod.startFormatted}
                    </DateValue>
                  
                </DateInfo>

                <ArrowSvg/>

                <DateInfo>
                    <DateTitle>ATÉ</DateTitle>
                    <DateValue selected={!!rentalPeriod.endFormatted}>
                    {rentalPeriod.endFormatted}
                    </DateValue>
                   
                </DateInfo>
            </RentalPeriod>
        </Header>

        <Content>
            <Calendar
              markedDates={markedDate}
                onDayPress={handleChangeDate}
              
            />
        </Content>

        <Footer>
            <Button enabled={!!rentalPeriod.startFormatted} onPress={handleConfirmRental} title="Confirmar"/>
        </Footer>
    </Container>
  );
}