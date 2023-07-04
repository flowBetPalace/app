import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import style from '@/assets/styles/PopUp.module.css'

// status solo puede ser: "success", "danger", "loading"
// message es el mensaje que aparece
// closable: true o false; significa si se puede cerrar la alerta
export default function PopUp() {
  const { PopUpActive, setPopUpActive, PopUpStatus, setPopUpStatus, PopUpMessage, setPopUpMessage, PopUpCloseable, setPopUpCloseable } = useContext(DataContext);

  const closePopUp = () => {
    if (PopUpCloseable) {
      setPopUpActive(false);
    }
  };

  let statusContent = null;

  if (PopUpStatus === 'success') {
    statusContent = (
      <Image
        src={"/icons/" + PopUpStatus + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (PopUpStatus === 'danger') {
    statusContent = (
      <Image
        src={"/icons/" + PopUpStatus + "-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  } else if (PopUpStatus === 'loading') {
    statusContent = (
      <div className={style.loadingWheel}>
        <div className={style.wheel}></div>
      </div>
    );
  } else {
    statusContent = (
      <Image
        src={"/icons/info-i.svg"}
        alt="Status icon"
        width={24}
        height={24}
      />
    );
  }
  if (!ModalActive) {
    return null;
  }
  return (
    <>
        <div className={style.darken} onClick={closePopUp}></div>
        <div className={style.popUp}>
          <div className={style.popUpContainer + ' container'}>
            <div className={style.content}>
              {PopUpCloseable && (
                <div className={style.closeBtn}>
                  <button onClick={closePopUp}>
                    <Image
                      src={"/icons/close.svg"}
                      alt="Close icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              )}
              <div className={style.img}>
                {statusContent}
              </div>
              <div className={style.text}>
                <p>
                  {PopUpMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
