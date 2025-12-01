import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { Hand, X } from "lucide-react-native";
import { useVLibras } from "@/contexts/_vlibras-context";

const VLIBRAS_TEMPLATE = (content) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>VLibras</title>
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px 20px 100px 20px;
      color: #333;
      line-height: 1.8;
      background: white;
    }
    h1 { 
      font-size: 26px; 
      color: #1976d2; 
      margin-bottom: 20px; 
      font-weight: bold; 
    }
    h2 { 
      font-size: 20px; 
      color: #1976d2; 
      margin: 24px 0 12px; 
      font-weight: 600; 
    }
    p { 
      margin-bottom: 14px; 
      font-size: 17px; 
    }
    ul { 
      margin: 16px 0; 
      padding-left: 24px; 
    }
    li { 
      margin-bottom: 10px; 
    }
    .info-box {
      background: #e3f2fd;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #1976d2;
    }
    .info-box strong { 
      color: #1565c0; 
    }
    #vlibras-container { 
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      z-index: 9999; 
    }
  </style>
</head>
<body>
  <div id="content">
    ${
      content ||
      '<p style="text-align: center; color: #999; padding: 40px;">Nenhum conteúdo disponível para tradução.</p>'
    }
  </div>
  
  <div id="vlibras-container">
    <div vw class="enabled">
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  </div>

  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  </script>
</body>
</html>
`;

const VLibrasWidget = () => {
  const { content } = useVLibras();
  const [isOpen, setIsOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  const handleOpen = () => {
    setCurrentContent(content);
    setIsOpen(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          zIndex: 9999,
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 30,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        accessibilityLabel="Abrir VLibras"
      >
        <Hand size={28} color="#fff" />
      </TouchableOpacity>

      {isOpen && (
        <Modal
          visible={isOpen}
          animationType="slide"
          onRequestClose={() => setIsOpen(false)}
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle="dark-content" />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
                backgroundColor: "#fff",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Hand size={24} color="#2563eb" />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginLeft: 12,
                  }}
                >
                  Tradutor para Libras
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "#f3f4f6",
                }}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <WebView
                key={currentContent}
                source={{ html: VLIBRAS_TEMPLATE(currentContent) }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={{ flex: 1, backgroundColor: "white" }}
                startInLoadingState={true}
                originWhitelist={["*"]}
              />
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
};

export default VLibrasWidget;
