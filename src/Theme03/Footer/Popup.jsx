import React from 'react';

const Popup = ({ onClose, imgSrc, title, message, confirmText, onConfirm }) => {
  return (
    <div className='absolute bottom-[330px] left-1/2 transform -translate-x-1/2 h-32 mt-2 z-50'>
      <div className='w-[300px] h-[361px] bg-[white] opacity-2 border rounded-lg flex flex-col justify-center items-center'>
        <div className='w-full h-[50px] flex justify-end'>
          <button className='w-12 h-12' onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
              <path d="M16.4506 14.0589L21.4673 9.05385C21.6869 8.83416 21.8104 8.5362 21.8104 8.22552C21.8104 7.91483 21.6869 7.61687 21.4673 7.39718C21.2476 7.1775 20.9496 7.05408 20.6389 7.05408C20.3282 7.05408 20.0303 7.1775 19.8106 7.39718L14.8056 12.4139L9.80059 7.39718C9.58091 7.1775 9.28294 7.05408 8.97226 7.05408C8.66157 7.05408 8.36361 7.1775 8.14393 7.39718C7.92424 7.61687 7.80082 7.91483 7.80082 8.22552C7.80082 8.5362 7.92424 8.83416 8.14393 9.05385L13.1606 14.0589L8.14393 19.0639C8.03458 19.1723 7.94778 19.3013 7.88855 19.4435C7.82932 19.5857 7.79883 19.7382 7.79883 19.8922C7.79883 20.0462 7.82932 20.1987 7.88855 20.3409C7.94778 20.483 8.03458 20.6121 8.14393 20.7205C8.25238 20.8299 8.38142 20.9167 8.52359 20.9759C8.66576 21.0351 8.81825 21.0656 8.97226 21.0656C9.12627 21.0656 9.27876 21.0351 9.42093 20.9759C9.5631 20.9167 9.69214 20.8299 9.80059 20.7205L14.8056 15.7039L19.8106 20.7205C19.9191 20.8299 20.0481 20.9167 20.1903 20.9759C20.3324 21.0351 20.4849 21.0656 20.6389 21.0656C20.7929 21.0656 20.9454 21.0351 21.0876 20.9759C21.2298 20.9167 21.3588 20.8299 21.4673 20.7205C21.5766 20.6121 21.6634 20.483 21.7226 20.3409C21.7819 20.1987 21.8124 20.0462 21.8124 19.8922C21.8124 19.7382 21.7819 19.5857 21.7226 19.4435C21.6634 19.3013 21.5766 19.1723 21.4673 19.0639L16.4506 14.0589Z" fill="#ADADAD"/>
            </svg>
          </button>
        </div>
        <img src={imgSrc} alt="Popup Icon" className="h-32 w-32" />
        <h1 className='my-2 text-[#020817] text-center font-[Roboto] text-[22px] font-semibold'>{title}</h1>
        <p className='mx-2 my-4 text-[#8D8D8D] text-center font-[Roboto] text-[14px] font-semibold'>{message}</p>
        <button className='flex w-[255px] h-[39px] justify-center items-center rounded-[10px] bg-[var(--Primary1,_#DB281C)] text-white' onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default Popup;
