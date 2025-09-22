import React, { useEffect, useState } from 'react';
import './InstallPrompt.css'

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                setDeferredPrompt(null);
                setShowInstallButton(false);
            });
        }
    };

    // hide prompt if already installed
    useEffect(() => {
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;

        if (isStandalone) {
            setShowInstallButton(false);
        }
    }, []);

    if (!showInstallButton) return null;

    return (
        <div className="install-container">
            <p className='install-text'>BushBuddy works better outside of your browser!</p>
            <button  className='install-button' onClick={handleInstallClick}>
                Add to Home Screen
            </button>
        </div>
    );
};

export default InstallPrompt;
