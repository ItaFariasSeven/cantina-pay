import { View, Text, Modal, TouchableOpacity, StyleSheet  } from 'react-native'
import { React, useState} from 'react'
import BackApp from '../components/BackApp'
import ModalCarrinhoCompras from '../components/ModalCarrinhoCompras' 
import ModalSelectCliente from '../components/ModalSelectCliente';

export default function Shopping() {

  const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);
  const [clienteVisivel, setClienteVisivel] = useState(false);

  return (
    <BackApp 
        onCartPress={() => setCarrinhoVisivel(true)}
        onClientPress={() => setClienteVisivel(true)}    
    >
        {/*  MODAL 1: CARRINHO  */}
        <Modal
            visible={carrinhoVisivel}
            transparent={true}
            animationType='slide'
            onRequestClose={() => setCarrinhoVisivel(false)}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalClickableArea}
                    activeOpacity={1}
                    onPress={() => setCarrinhoVisivel(false)}
                />

                <View style={styles.modalContent}>
                    <ModalCarrinhoCompras 
                        onClose={() => setCarrinhoVisivel(false)}
                        onConfirm={() => {
                          setCarrinhoVisivel(false); // 1. Fecha o carrinho
                          setClienteVisivel(true);   // 2. Abre a tela de clientes logo em seguida
                        }}
                    />
                </View>
            </View>
        </Modal>

        {/*  MODAL 2: SELECIONAR CLIENTE  */}
        <Modal
          visible={clienteVisivel}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setClienteVisivel(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalClickableArea} activeOpacity={1} onPress={() => setClienteVisivel(false)} />
            <View style={styles.modalContent}>
              
              {/* Renderiza o modal de cliente e passa a função para fechar */}
              <ModalSelectCliente onClose={() => setClienteVisivel(false)} />

            </View>
          </View>
        </Modal>

    </BackApp>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    // flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    // position: 'absolute',
    // height: '100%',
    // width: '100%',
},
// modalClickableArea: {
//     flex: 1,
//     width:'90%',
// },
modalContent: {
    // flex: 1,
    height: '103%',
    width: '100%',
    paddingRight: 0,
    marginLeft: '10%',
    top:'0%',
  }
});