import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon, CloseIcon } from './icons';

interface CodeLibraryModalProps {
  onClose: () => void;
}

const ESP32_CODE = `
/*
 * Cosmos Controller - ESP32 Code
 * ==============================
 * This code allows an ESP32 to be controlled by the Cosmos web app.
 * It supports both Wi-Fi (Web Server) and Bluetooth Serial.
 * 
 * Instructions:
 * 1. Uncomment the desired mode (WIFI_MODE or BLUETOOTH_MODE).
 * 2. Update Wi-Fi credentials if using WIFI_MODE.
 * 3. Select the correct motor driver pin configuration.
 * 4. Upload to your ESP32 board.
 */

// Step 1: Choose your connection mode (uncomment one)
#define WIFI_MODE
// #define BLUETOOTH_MODE

#ifdef WIFI_MODE
#include <WiFi.h>
#include <WebServer.h>
// Step 2: Update your Wi-Fi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
WebServer server(80);
#endif

#ifdef BLUETOOTH_MODE
#include "BluetoothSerial.h"
BluetoothSerial SerialBT;
String device_name = "ESP32_BT_Motor";
#endif

// Step 3: Motor Driver Pin Configuration
// Option A: L298N Driver
const int ENA = 5;  // PWM Speed Control
const int IN1 = 18;
const int IN2 = 19;

// Option B: Custom Driver (1 IN, 2 EN)
// const int C_IN1 = 18;
// const int EN1 = 5;   // PWM for Forward
// const int EN2 = 19;  // PWM for Backward

void setup() {
  Serial.begin(115200);

  // Motor Pin Setup for L298N
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  // Motor Pin Setup for Custom Driver
  // pinMode(C_IN1, OUTPUT);
  // pinMode(EN1, OUTPUT);
  // pinMode(EN2, OUTPUT);

#ifdef WIFI_MODE
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/motor", handleMotor);
  server.begin();
#endif

#ifdef BLUETOOTH_MODE
  SerialBT.begin(device_name);
  Serial.println("Bluetooth device is ready to pair");
#endif
}

void loop() {
#ifdef WIFI_MODE
  server.handleClient();
#endif

#ifdef BLUETOOTH_MODE
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\\n');
    processCommand(command);
  }
#endif
}

#ifdef WIFI_MODE
void handleMotor() {
  if (server.hasArg("cmd")) {
    String command = server.arg("cmd");
    processCommand(command);
    server.send(200, "text/plain", "OK: " + command);
  } else {
    server.send(400, "text/plain", "Bad Request");
  }
}
#endif

void processCommand(String cmd) {
  Serial.println("Received: " + cmd);
  char direction = cmd.charAt(0);
  int speed = cmd.substring(1).toInt();

  if (direction == 'F') {
    moveMotor(true, speed); // Forward
  } else if (direction == 'B') {
    moveMotor(false, speed); // Backward
  } else if (direction == 'S') {
    stopMotor();
  }
}

void moveMotor(bool forward, int speed) {
  // --- L298N Logic ---
  digitalWrite(IN1, forward ? HIGH : LOW);
  digitalWrite(IN2, forward ? LOW : HIGH);
  analogWrite(ENA, speed);

  // --- Custom Driver Logic ---
  // digitalWrite(C_IN1, HIGH); // Or LOW depending on your design
  // if (forward) {
  //   analogWrite(EN1, speed);
  //   analogWrite(EN2, 0);
  // } else {
  //   analogWrite(EN1, 0);
  //   analogWrite(EN2, speed);
  // }
}

void stopMotor() {
  // --- L298N Logic ---
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);

  // --- Custom Driver Logic ---
  // analogWrite(EN1, 0);
  // analogWrite(EN2, 0);
}
`.trim();

const ARDUINO_UNO_CODE = `
/*
 * Cosmos Controller - Arduino UNO Code
 * =====================================
 * This code allows an Arduino UNO to be controlled by the Cosmos web app,
 * typically via a Bluetooth module like HC-05 or HC-06.
 *
 * Instructions:
 * 1. Connect your Bluetooth module to the UNO (TX->RX, RX->TX).
 * 2. Select the correct motor driver pin configuration.
 * 3. Upload to your Arduino UNO board.
 * 4. The app sends commands over Bluetooth which are read by the serial port.
 */

// Step 2: Motor Driver Pin Configuration
// Pins must be PWM-capable (marked with ~ on the UNO board) for speed control.
// Option A: L298N Driver
const int ENA = 5;  // PWM Speed Control (must be a ~ pin)
const int IN1 = 7;
const int IN2 = 8;

// Option B: Custom Driver (1 IN, 2 EN)
// const int C_IN1 = 8;
// const int EN1 = 5;   // PWM for Forward (must be a ~ pin)
// const int EN2 = 6;   // PWM for Backward (must be a ~ pin)

void setup() {
  // Use a baud rate that matches your Bluetooth module's configuration (9600 is common)
  Serial.begin(9600); 

  // Motor Pin Setup for L298N
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  // Motor Pin Setup for Custom Driver
  // pinMode(C_IN1, OUTPUT);
  // pinMode(EN1, OUTPUT);
  // pinMode(EN2, OUTPUT);

  Serial.println("Arduino UNO Ready for Commands...");
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\\n');
    processCommand(command);
  }
}

void processCommand(String cmd) {
  if (cmd.length() > 0) {
    Serial.println("Received: " + cmd);
    char direction = cmd.charAt(0);
    int speed = cmd.substring(1).toInt();

    if (direction == 'F') {
      moveMotor(true, speed); // Forward
    } else if (direction == 'B') {
      moveMotor(false, speed); // Backward
    } else if (direction == 'S') {
      stopMotor();
    }
  }
}

void moveMotor(bool forward, int speed) {
  // --- L298N Logic ---
  digitalWrite(IN1, forward ? HIGH : LOW);
  digitalWrite(IN2, forward ? LOW : HIGH);
  analogWrite(ENA, speed);

  // --- Custom Driver Logic ---
  // digitalWrite(C_IN1, HIGH); // Or LOW depending on your design
  // if (forward) {
  //   analogWrite(EN1, speed);
  //   analogWrite(EN2, 0);
  // } else {
  //   analogWrite(EN1, 0);
  //   analogWrite(EN2, speed);
  // }
}

void stopMotor() {
  // --- L298N Logic ---
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);
  
  // --- Custom Driver Logic ---
  // analogWrite(EN1, 0);
  // analogWrite(EN2, 0);
}
`.trim();

type Board = 'ESP32' | 'UNO';

const CodeLibraryModal: React.FC<CodeLibraryModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Board>('ESP32');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeToCopy = activeTab === 'ESP32' ? ESP32_CODE : ARDUINO_UNO_CODE;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-11/12 max-w-3xl h-5/6 bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl shadow-red-900/30 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Hardware Code Library</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-4 flex-shrink-0">
          <div className="flex space-x-1 bg-black/40 rounded-lg p-1">
            <TabButton board="ESP32" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton board="UNO" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>

        <div className="relative flex-grow overflow-hidden px-4 pb-4">
          <pre className="h-full overflow-auto rounded-lg bg-black/50 p-4 text-sm text-gray-300 custom-scrollbar">
            <code>{activeTab === 'ESP32' ? ESP32_CODE : ARDUINO_UNO_CODE}</code>
          </pre>
          <button 
            onClick={handleCopy}
            className="absolute top-3 right-7 flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 border border-white/10 rounded-md text-xs text-white/80 hover:bg-gray-600/50 transition-colors"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 3px; }
      `}</style>
    </div>
  );
};

interface TabButtonProps {
    board: Board;
    activeTab: Board;
    setActiveTab: (board: Board) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ board, activeTab, setActiveTab }) => {
    const isActive = board === activeTab;
    return (
        <button
            onClick={() => setActiveTab(board)}
            className={`w-full text-center py-2 rounded-md transition-colors text-sm font-semibold
                ${isActive ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/10'}
            `}
        >
            {board === 'UNO' ? 'Arduino UNO' : 'ESP32'}
        </button>
    )
}

export default CodeLibraryModal;
