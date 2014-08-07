#include <LiquidCrystal.h>
#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>
#include <string>

LiquidCrystal TFTScreen(9, 6, 5, 4, 3, 2);

//CONFIGURATION
const int TEMP_SENSOR_ANALOG_PIN = A0; //ARDUINO ANALOG PIN
const int SOUND_SENSOR_ANALOG_PIN = A1;

char DEVICE_ADDRES[7] = "D0001";
char SERVER_ADDRES[7] = "SERVER";
char DEVICE[4] = "001"; //DEVICE NUMBER

//INTERNAL VARIABLES
char SEPARATOR[2] = "|";
char END_OF_PACKET[2] = "#";

float prevC = 150,
      toleranceC = 0.5;

void setup(){
  Serial.begin(9600);

  TFTScreen.begin(16, 2);
  TFTScreen.print("Iniciando");
  delay(1000);
  TFTScreen.print(".");
  delay(1000);
  TFTScreen.print(".");
  delay(1000);
  TFTScreen.print(".");
  delay(1000);
  TFTScreen.clear();
  Mirf.spi = &MirfHardwareSpi;
  Mirf.init();
  Mirf.setRADDR((byte *)DEVICE_ADDRES);
  Mirf.payload = 20;
  
  Mirf.channel = 90;
  Mirf.config();
  Mirf.configRegister(RF_SETUP,0x06); // 1MHz
}

void transmit(char *string){
  Mirf.send((uint8_t*) string);
} 

char* createPacket(char* code, char* value){
    char charPacket [100];  
    String packet = "";
    packet = DEVICE;
    packet = packet + SEPARATOR;
    packet = packet + code;
    packet = packet + SEPARATOR;
    packet = packet + value;
    packet = packet + "#";
    strcpy(charPacket, packet.c_str());
    Serial.println(charPacket);
    return charPacket;
};

void loop() {
  delay(2000);
  
  char buffer[50];
  char* charPacket;
  boolean isShowC = false;
  byte data[20];
  
  Mirf.setTADDR((byte *)SERVER_ADDRES);
  
  //RECEPCION DE PAQUETES DE ALERTA O CONFIGURACION
  if(!Mirf.isSending() && Mirf.dataReady()){
    Mirf.getData(data);
    char* packet = (char*)data;
    
    //Obtengo el código de acción
    int len = 2;
    char code[len+1];
    strncpy(code, &packet[0], len);
    code[len] = '\0';
    
    //Obtengo el valor del mensaje
    len = 30;
    char message[len+1];
    strncpy(message, &packet[2], len);
    message[len] = '\0';
  
    if(code[0] == '0' && code[1] == '1'){
      TFTScreen.setCursor(0,1);
      TFTScreen.print("                ");
      delay(100);
      TFTScreen.setCursor(0,1);
      TFTScreen.print((char*)message);
    }else if(code[0] == '0' && code[1] == '1'){
      //TODO: MENSAJE DE CONFIGURACION
    }
  }
 
  float c = (5.0 * analogRead(TEMP_SENSOR_ANALOG_PIN) * 100.0) / 1024;
  double db =  20.0  * log10 (analogRead(SOUND_SENSOR_ANALOG_PIN)  +1.);
  
  if(!isnan(c) && (c > (prevC + toleranceC) || c < (prevC - toleranceC))){
    prevC = c;
    
    TFTScreen.setCursor(0,0);
    TFTScreen.print(c);
    TFTScreen.setCursor(5,0);
    TFTScreen.print("c");
    
    charPacket = createPacket("01", dtostrf(c, 5, 2, buffer));   
    transmit(charPacket);
  } 
  
  if(!isnan(db)){
    TFTScreen.setCursor(7,0);
    TFTScreen.print(db);
    TFTScreen.setCursor(11,0);
    TFTScreen.print("db");
    
    charPacket = createPacket("03", dtostrf(db, 5, 2, buffer));   
    //transmit(charPacket);
  } 
}


