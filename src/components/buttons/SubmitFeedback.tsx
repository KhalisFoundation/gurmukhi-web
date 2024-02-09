import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    JotformFeedback: any;
  }
}

const SubmitFeedback: React.FC = () => {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedbackRef.current) return;

    const jotformFeedback = () => {
      // Script for JotformFeedback
      new window.JotformFeedback({
        type: 2,
        width: 720,
        height: 840,
        fontColor: '#FFFFFF',
        background: '#F59202',
        isCardForm: false,
        formId: '240394066555864',
        buttonText: 'Submit Feedback',
        buttonSide: 'right',
        buttonAlign: 'center',
        base: 'https://form.jotform.com/',
      });

      // Script for handling iframe message
      const ifr = document.getElementById('lightbox-240394066555864') as HTMLIFrameElement;
      if (ifr) {
        let src = ifr.src;
        let iframeParams: string[] = [];
        if (window.location.href && window.location.href.indexOf('?') > -1) {
          iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf('?') + 1).split('&'));
        }
        if (src && src.indexOf('?') > -1) {
          iframeParams = iframeParams.concat(src.substr(src.indexOf('?') + 1).split('&'));
          src = src.substr(0, src.indexOf('?'));
        }
        iframeParams.push('isIframeEmbed=1');
        ifr.src = src + '?' + iframeParams.join('&');
      }
    };

    // Function to handle iframe message
    const handleIFrameMessage = (e: MessageEvent) => {
      // Implementation for handling iframe messages
      if (e.data === 'JotformFeedbackLoaded') {
        const ifr = document.getElementById('lightbox-240394066555864') as HTMLIFrameElement;
        if (ifr) {
          ifr.style.display = 'block';
        }
      }
    };

    // Add event listener for handling iframe messages
    if (window.addEventListener) {
      window.addEventListener('message', handleIFrameMessage, false);
    } else if ((window as any).attachEvent) {
      (window as any).attachEvent('onmessage', handleIFrameMessage);
    }

    // Call jotformFeedback function
    jotformFeedback();

    // Clean up event listener on unmount
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('message', handleIFrameMessage);
      } else if ((window as any).detachEvent) {
        (window as any).detachEvent('onmessage', handleIFrameMessage);
      }
    };
  }, []);

  return (
    <div ref={feedbackRef}></div>
  );
};

export default SubmitFeedback;
