import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  Button,
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import useAuth from "@/hooks/_useAuth";

export const ProfileEdit = ({ isOpen, onClose, handleSave }) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  return (
    <View>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalBackdrop />
        <ModalContent className="mx-4">
          <ModalHeader>
            <Text className="text-lg font-semibold">Editar perfil</Text>
          </ModalHeader>
          <ModalBody>
            <FormControl className="mb-3">
              <FormControlLabel>
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Seu nome"
                  accessibilityLabel="Editar nome"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Telefone</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  accessibilityLabel="Editar telefone"
                />
              </Input>
            </FormControl>
          </ModalBody>
          <ModalFooter className="flex-row gap-3">
            <Button variant="outline" onPress={onClose}>
              <Text className="font-semibold text-gray-800">Cancelar</Text>
            </Button>
            <Button variant="solid" onPress={handleSave}>
              <Text className="text-white font-semibold">Salvar</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};
