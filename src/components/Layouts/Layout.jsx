import Navbar from '@/components/Layouts/Navbar'
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
