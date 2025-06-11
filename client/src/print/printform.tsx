'use client'


export default function PrintForm() {

    const handleprint = () => {
        window.print();
    }
    return ( 
        <div>PrintForm

            <button onClick={handleprint}>Print</button>
        </div>

    )
}