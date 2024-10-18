import "../styles/globals.scss";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  connectorsForWallets, getDefaultWallets, RainbowKitProvider, createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import {
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import { baseSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import axios from "axios";
import { SiweMessage } from 'siwe';
import { ToastContainer } from "react-toastify";

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import Head from "next/head";
import { URLs } from "../utils/constants";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

const projectId = "149f84ff95a763d7bccbb4f6cd3cf883";

const { wallets } = getDefaultWallets({
  appName: "HoodyGang",
  projectId: projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      trustWallet({ projectId, chains })
    ]
  }
])

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState('loading');

  // Fetch user when:
  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await axios.get(`${URLs.HoodyBackendAuthURL}/myInfo`, { withCredentials: true });
        setAuthStatus(response.data.address ? 'authenticated' : 'unauthenticated');
      } catch (_error) {
        setAuthStatus('unauthenticated');
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    // 1. page loads
    fetchStatus();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', fetchStatus);
    return () => window.removeEventListener('focus', fetchStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const nonce = (await axios.get(`${URLs.HoodyBackendAuthURL}/getNonce`, { withCredentials: true })).data;
        return await nonce;
      },

      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to HoodyGang.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },

      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },

      verify: async ({ message, signature }) => {
        verifyingRef.current = true;

        try {
          const response = await axios.post(`${URLs.HoodyBackendAuthURL}/verify`, ({ message: message, signature: signature }), { withCredentials: true }, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          const authenticated = Boolean(response.data.ok);

          if (authenticated) {
            setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
          }

          return authenticated;
        } catch (error) {
          return false;
        }
      },

      signOut: async () => {
        setAuthStatus('unauthenticated');
        await axios.get(`${URLs.HoodyBackendAuthURL}/logOut`, { withCredentials: true });
      },
    });
  }, []);

  return (
    <>
      <Head>
        <title>HoodyGang</title>
        <meta name="description" content="Hoodygang NFT is a collection that offers customizable digital artwork on the ethereum blockchain. Explore the world of Hoodygang and discover how this decentralized app (dApp) is revolutionizing the art industry." />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <WagmiConfig config={config}>
        <RainbowKitAuthenticationProvider
          adapter={authAdapter}
          status={authStatus}
        >
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} authStatus={authStatus} />
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </WagmiConfig>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default MyApp