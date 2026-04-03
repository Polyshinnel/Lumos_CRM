import './bootstrap';
import '../css/app.css';
import '@mantine/core/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { App } from './App';

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error('Element with id "app" was not found.');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MantineProvider>
    </React.StrictMode>
);
