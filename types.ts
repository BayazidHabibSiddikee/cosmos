
export enum ConnectionType {
  WIFI = 'Wi-Fi',
  BLUETOOTH = 'Bluetooth',
}

export enum BoardType {
  UNO = 'Arduino UNO',
  ESP32 = 'ESP32',
}

export enum DriverType {
  L298N = 'L298N',
  CUSTOM = 'Custom Driver',
}

export enum MotorDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  STOP = 'stop',
}

export enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting...',
  FAILED = 'Connection Failed',
}
