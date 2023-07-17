import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import style from '@/assets/styles/Timer.module.css'

export default function Timer({rawStartDate, rawEndDate, goToBets}) {

    function parseDate(rawDate) {
        const [datePart, timePart] = rawDate.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = timePart.split(":");
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    
    const startDate = parseDate(rawStartDate);
    const endDate = parseDate(rawEndDate);

    function getTimeRemaining() {
        const currentDate = new Date();
        const timeDifferenceStart = startDate - currentDate;
        // console.log(timeDifferenceStart);
        const timeDifferenceEnd = endDate - currentDate;
        // console.log(timeDifferenceEnd);
        if (isNaN(timeDifferenceStart) && isNaN(timeDifferenceEnd)) {
            return {
                loading: true
            }
        }
        if (timeDifferenceStart > 0) {
            const days = Math.floor(timeDifferenceStart / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifferenceStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifferenceStart % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifferenceStart % (1000 * 60)) / 1000);
            // console.log("day: ", days, " hours: ", hours, "minutes: ", minutes, "seconds: ", seconds, "live: ", false);
            return {
                days,
                hours,
                minutes,
                seconds,
                live: false
            };
        } else if (timeDifferenceEnd > 0) {
            const days = Math.floor(timeDifferenceEnd / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifferenceEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifferenceEnd % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifferenceEnd % (1000 * 60)) / 1000);
            // console.log("day: ", days, " hours: ", hours, "minutes: ", minutes, "seconds: ", seconds, "live: ", true);
            return {
                days,
                hours,
                minutes,
                seconds,
                live: true
            };
        } else {
            // console.log("day: ", 0, " hours: ", 0, "minutes: ", 0, "seconds: ", 0, "live: ", false);
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                live: false
            };
        }
    }
    
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining());
        }, 1000);
    
        return () => {
            clearInterval(timer);
        };
    }, [startDate, endDate]);


    let timerContent = null;

    if (timeRemaining.loading) {
        timerContent = (
            <p>Loading...</p>
        )
    } else if (timeRemaining.live) {
        timerContent = (
            <div className='d-flex gap-3'>
                <div className={style.timerLive}>
                    <Image
                        src="/icons/circle.svg"
                        alt="Live icon"
                        width={8}
                        height={8}
                    />
                    <p className={style.timerLiveSquare}>
                        Live
                    </p>
                </div>
                <p>
                    Remaining time:
                    {timeRemaining.days > 0 && (' ' + timeRemaining.days + ' days ')}
                    {(timeRemaining.hours > 0 || timeRemaining.days > 0) && (timeRemaining.hours + ' hours ')}
                    {(timeRemaining.minutes > 0 || timeRemaining.hours > 0 || timeRemaining.days > 0) && (timeRemaining.minutes + ' minutes ')}
                    {timeRemaining.seconds} seconds
                </p>
            </div>
        );
    } else if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
        timerContent = <>
            <p className='d-inline-block'>
              Event ended
            </p>
            {goToBets && (
                <Link href="/mybets" className={'float-end text-white'}>
                    Go to my bets
                </Link>
            )}
        </>;
    } else {
        timerContent = (
        <p>
            Starting in
            {timeRemaining.days > 0 && (' ' + timeRemaining.days + ' days ')}
            {(timeRemaining.hours > 0 || timeRemaining.days > 0) && (timeRemaining.hours + ' hours ')}
            {(timeRemaining.minutes > 0 || timeRemaining.hours > 0 || timeRemaining.days > 0) && (timeRemaining.minutes + ' minutes ')}
            {timeRemaining.seconds} seconds
        </p>
        );
    }
    return(
        <div className={style.timer}>
            {timerContent}
        </div>
    )
}
