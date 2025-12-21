import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showBarcode?: boolean;
  onBarcodeScanned?: (barcode: string) => void;
}

export const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder, 
  showBarcode,
  onBarcodeScanned 
}: SearchBarProps) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarcodePress = async () => {
    if (!permission) {
      // Les permissions sont en cours de chargement
      return;
    }

    if (!permission.granted) {
      // Demander la permission
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission requise',
          'L\'accès à la caméra est nécessaire pour scanner les codes-barres.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    // Ouvrir le scanner
    setScannerVisible(true);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setScannerVisible(false);
    
    // Mettre à jour la recherche avec le code scanné
    onChangeText(data);
    
    // Callback optionnel
    if (onBarcodeScanned) {
      onBarcodeScanned(data);
    }

    Alert.alert(
      'Code-barres scanné',
      `Code: ${data}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <View style={searchStyles.container}>
        <Ionicons name="search" size={20} color="#E91E63" />
        <TextInput
          style={searchStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        {showBarcode && (
          <TouchableOpacity onPress={handleBarcodePress}>
            <Ionicons name="barcode-outline" size={24} color="#E91E63" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal du Scanner */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={searchStyles.scannerContainer}>
          <CameraView
            style={searchStyles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr',
                'ean13',
                'ean8',
                'code128',
                'code39',
                'code93',
                'upc_a',
                'upc_e',
              ],
            }}
          >
            <View style={searchStyles.scannerOverlay}>
              {/* Header */}
              <View style={searchStyles.scannerHeader}>
                <TouchableOpacity
                  style={searchStyles.closeButton}
                  onPress={() => setScannerVisible(false)}
                >
                  <Ionicons name="close" size={32} color="white" />
                </TouchableOpacity>
              </View>

              {/* Zone de scan */}
              <View style={searchStyles.scannerMiddle}>
                <View style={searchStyles.scanFrame}>
                  <View style={[searchStyles.corner, searchStyles.topLeft]} />
                  <View style={[searchStyles.corner, searchStyles.topRight]} />
                  <View style={[searchStyles.corner, searchStyles.bottomLeft]} />
                  <View style={[searchStyles.corner, searchStyles.bottomRight]} />
                </View>
              </View>

              {/* Instructions */}
              <View style={searchStyles.scannerFooter}>
                <Text style={searchStyles.instructionText}>
                  Placez le code-barres dans le cadre
                </Text>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </>
  );
};

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scannerHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00A8E8',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scannerFooter: {
    paddingBottom: 80,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
