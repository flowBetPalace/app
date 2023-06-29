import Navbar from '@/components/Navbar'
import { DataProvider } from "@/context/DataContext";

export default function Layout({children}){
    return (
        <>
        <DataProvider>
            <Navbar />
            {children}
        </DataProvider>
        </>
    )
}
