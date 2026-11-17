## Edytor-i-symulator-ukladow-logicznych-2D

# Definicje bramek w kodzie powinny wyglądać tak:

const GATE_DEFINITIONS = {
  "AND": {
    id: "AND",
    label: "Bramka AND",
    size: { width: 80, height: 50 },
    inputs: ["in_A", "in_B"],
    outputs: ["out_Q"],
    // funkcja ewaluacji którą odpala w silniku symulacji
    evaluate: (inputs) => (inputs.in_A && inputs.in_B ? 1 : 0)
  },
  "NOT": {
    id: "NOT",
    label: "Negator",
    size: { width: 60, height: 40 },
    inputs: ["in_A"],
    outputs: ["out_Q"],
    evaluate: (inputs) => (inputs.in_A === 1 ? 0 : 1)
  }
  // reszta analogicznie dla OR, XOR, SWITCH, LED itp
};



# Architektura stanu aplikacji

const projectState = {
  meta: {
    name: "Projekt_1"
  },
  
  // zarzadzanie widokiem
  camera: {
    x: 0, 
    y: 0, 
    zoom: 1.0 
  },

  // węzły
  nodes: {
    "node_123": {
      type: "AND",           // odwołanie do GATE_DEFINITIONS
      x: 200, y: 150,        // zaktualizowane przy przesuwaniu
      
      // Bieżące stany dla silnika Michała (0, 1 lub null jeśli brak sygnału)
      inputStates: { "in_A": 1, "in_B": 0 },
      outputStates: { "out_Q": 0 }
    }
  },

  // kable
  wires: {
    "wire_456": {
      fromNode: "node_123",
      fromPin: "out_Q",
      toNode: "node_789",
      toPin: "in_A",
      
      // stan kabla (zielony albo czerwony w zależności od stanu (logikę kabli robię ja w razie co)
      state: 0 
    }
  }
};


# Struktura pliku JSON do eksportu i importu

{
  "projectInfo": {
    "name": "bramki",
    "createdAt": "jakas data"
  },
  "components": [
    {
      "id": "gate_1",
      "type": "AND",
      "position": { "x": 250, "y": 100 },
      "properties": {
        "inputsCount": 2
      }
    },
    {
      "id": "switch_1",
      "type": "INPUT",
      "position": { "x": 50, "y": 80 },
      "state": 1 
    },
    {
      "id": "switch_2",
      "type": "INPUT",
      "position": { "x": 50, "y": 120 },
      "state": 0
    }
  ],
  "connections": [
    {
      "id": "wire_1",
      "source": { "componentId": "switch_1", "pin": "out" },
      "target": { "componentId": "gate_1", "pin": "in_1" }
    },
    {
      "id": "wire_2",
      "source": { "componentId": "switch_2", "pin": "out" },
      "target": { "componentId": "gate_1", "pin": "in_2" }
    }
  ]
}
