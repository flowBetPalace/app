import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import style from '@/assets/styles/PopUp.module.css'

export default function BetModal() {
  const { BetModalActive, setBetModalActive, BetModalStatus, setBetModalStatus, BetModalMessage, setBetModalMessage, BetModalCloseable, setBetModalCloseable } = useContext(DataContext);

  const closeModal = () => {
    if (BetModalCloseable) {
      setBetModalActive(false);
      setBetModalMessage('');
      setBetModalCloseable(true);
      setBetModalStatus('');
    }
  };

  // let statusContent = null;

  // if (BetModalStatus === 'success') {
  //   statusContent = (
  //     <Image
  //       src={"/icons/" + BetModalStatus + "-i.svg"}
  //       alt="Status icon"
  //       width={24}
  //       height={24}
  //     />
  //   );
  // } else if (BetModalStatus === 'danger') {
  //   statusContent = (
  //     <Image
  //       src={"/icons/" + BetModalStatus + "-i.svg"}
  //       alt="Status icon"
  //       width={24}
  //       height={24}
  //     />
  //   );
  // } else if (BetModalStatus === 'loading') {
  //   statusContent = (
  //     <div className={style.loadingWheel}>
  //       <div className={style.wheel}></div>
  //     </div>
  //   );
  // } else {
  //   statusContent = (
  //     <Image
  //       src={"/icons/info-i.svg"}
  //       alt="Status icon"
  //       width={24}
  //       height={24}
  //     />
  //   );
  // }
  if (!BetModalActive) {
    return null;
  }
  return (
    <>
        <div className={style.darken} onClick={closeModal}></div>
        <div className={style.modal}>
          <div className={style.modalContainer + ' container'}>
            <div className={style.content}>
              {BetModalCloseable && (
                <div className={style.closeBtn}>
                  <button onClick={closeModal}>
                    <Image
                      src={"/icons/close.svg"}
                      alt="Close icon"
                      width={24}
                      height={24}
                      className={style.closePop}
                    />
                  </button>
                </div>
              )}
              {BetModalMessage}
            </div>
          </div>
        </div>
    </>
  )
}
