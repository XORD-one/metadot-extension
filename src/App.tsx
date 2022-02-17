import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { AccountJson } from 'metadot-extension-base/background/types';
import { QueryClientProvider, QueryClient } from 'react-query';
import {
    setLoggedIn,
    setPublicKey,
    setAccountName,
} from './redux/slices/activeAccount';
import { addAccount } from './redux/slices/accounts';
import { RootState } from './redux/store';
import './App.css';
import ApiManager from './components/api-manager';
import { routes } from './utils';
import Views from './components';
import { subscribeAccounts } from './messaging';

function App(): JSX.Element {
    const [accounts, setAccounts] = useState<null | AccountJson[]>(null);
    const { AuthRoutes, UnAuthRoutes } = routes;
    const { Welcome, WelcomeBack } = Views;
    const { activeAccount } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();
    const queryClient = new QueryClient();

    useEffect(() => {
        subscribeAccounts(setAccounts);
    }, []);

    useEffect(() => {
        const saveAccountInRedux = ({
            name,
            address,
            parentAddress,
        }: any): void => {
            // setting active account
            dispatch(setLoggedIn(true));
            dispatch(setPublicKey(address));
            dispatch(setAccountName(name));

            // setting all accounts
            dispatch(
                addAccount({
                    accountName: name,
                    publicKey: address,
                    parentAddress,
                })
            );
        };

        if (accounts && accounts.length > 0) {
            saveAccountInRedux(accounts[accounts.length - 1]);
        }
        console.log('accounts ==>>', accounts);
    }, [accounts]);

    let content;
    if (!activeAccount.isLoggedIn && activeAccount.publicKey) {
        content = <Route path="/" element={<WelcomeBack />} />;
    } else if (activeAccount.isLoggedIn && activeAccount.publicKey) {
        try {
            content = (
                <>
                    {AuthRoutes.map((route) => {
                        const { path, Component } = route;
                        return (
                            <Route
                                key={path}
                                path={path}
                                element={<Component />}
                            />
                        );
                    })}
                </>
            );
        } catch (error) {
            console.log('error in app.js', error);
        }
    } else {
        content = (
            <>
                <Route path="/" element={<Welcome />} />;
                {UnAuthRoutes.map((route) => {
                    const { path, Component } = route;
                    return (
                        <Route key={path} path={path} element={<Component />} />
                    );
                })}
            </>
        );
    }

    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <ApiManager rpc={activeAccount.rpcUrl} />
                <Routes>{content}</Routes>
            </QueryClientProvider>
        </div>
    );
}

export default App;
