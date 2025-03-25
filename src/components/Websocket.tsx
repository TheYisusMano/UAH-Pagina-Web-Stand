import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import cookies from 'js-cookies';

const WebSocketComponent = () => {
  const isBrowser = typeof window !== 'undefined';
  const socketUrl = 'ws://207.246.73.245:3077/universidad/qr';

  const [qrCode, setQrCode] = useState<string>();
  const [estasAutenticado, setEstasAutenticado] = useState<boolean>(false);

  const { lastJsonMessage } = isBrowser
    ? useWebSocket(socketUrl)
    : { lastJsonMessage: null };

  useEffect(() => {
    const mensage = lastJsonMessage as any;
    if (!mensage) return;

    if (mensage.event == 'GET_IMAGE') {
      setQrCode(mensage.image as string);
    }

    if (mensage.event == 'AUTH') {
      cookies.setItem('access_token', mensage.data.token);
      setEstasAutenticado(true);
    }

  }, [lastJsonMessage]);

  return (
    <div className="flex mt-10 mb-20 items-center flex-col justify-center">
      <h2 className="text-3xl font-semibold">Iniciar Sesión</h2>
      <div className="rounded-xl mt-10 flex flex-col items-center min-w-[600px] bg-white p-8">
        <p className="text-2xl max-w-[400px] text-black text-center font-semibold">
          Registrate utilizando la aplicación mobile de la UAH
        </p>
        {estasAutenticado && <div className="text-black text-2xl mt-4">Estas autenticado.</div>}
        {lastJsonMessage && (
          <img className="w-full aspect-square" src={qrCode}></img>
        )}
      </div>
    </div>
  );
};

export default WebSocketComponent;
