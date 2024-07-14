import axios from 'axios'
import { useEffect, useState } from 'react'
import TransactionChart from '../TransactionChart/TransactionChart'

export default function Home() {

    const [customers, setCustomers] = useState([])
    const [transactions, setTransactions] = useState([])
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [filterByAmount, setFilterByAmount] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    async function getCustomers() {

        // 'http://localhost:5000/customers' For json server
        
        let { data } = await axios.get('https://6693fde9c6be000fa07dd61e.mockapi.io/api/v1/customers')
            .catch(error => console.log('Error fetching Customers data:', error));
        setCustomers(data)
        setFilteredCustomers(data)
    }

    async function getTransactions() {

        // 'http://localhost:5000/transactions' For json server

        let { data } = await axios.get('https://6693fde9c6be000fa07dd61e.mockapi.io/api/v1/transactions')
            .catch(error => console.log('Error fetching Transactions data:', error));
        setTransactions(data)
        setFilterByAmount(data)
    }

    function searchForName(value) {
        setFilteredCustomers(customers.filter(customer => customer.name.toLowerCase().includes(value.toLowerCase())))

        if (!value) {
            setFilteredCustomers(customers)
        }
        if (customers.filter(customer => customer.name.toLowerCase().includes(value.toLowerCase())).length == 0) {
            setFilteredCustomers('')

        }
    }

    function searchForAmount(value) {

        setFilterByAmount(transactions.filter(transaction => transaction.amount.toString().includes(value)));

        if (!value) {
            setFilterByAmount(transactions)
        }

        if (transactions.filter(transaction => transaction.amount.toString().includes(value)).length == 0) {
            setFilterByAmount('')

        }
    }

    function handleCustomerClick(customer) {
        setSelectedCustomer(customer)
    }

    useEffect(() => {
        getCustomers()
        getTransactions()
    }, [])

    return <>
        <div className='mainComponent'>
            <div className='container'>
                <h1 className='text-center text-secondary'>Customers Transactions</h1>
                <div className='d-flex align-items-center justify-content-center gap-3 mx-5 mt-4 mb-5'>
                    <input onChange={(e) => searchForName(e.target.value)} className='form-control' type='text' placeholder='search by customer name' />
                    <input onChange={(e) => searchForAmount(e.target.value)} className='form-control' type='number' placeholder='search by transaction amount' />
                </div>

                <table className='table table-bordered border-dark text-center table-striped-columns'>
                    <thead>
                        <tr>
                            <th> Customer ID	</th>
                            <th> Customer Name</th>
                            <th> Transaction Date	</th>
                            <th> Transaction Amount	</th>
                        </tr>
                    </thead>
                    <tbody>

                        {(filterByAmount && filteredCustomers) ? <>{filteredCustomers?.map(customer => filterByAmount?.filter(transaction => transaction.customer_id == customer.id).map(transaction => <tr key={transaction.id} onClick={() => handleCustomerClick(customer)} role='button'>

                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.amount}</td>
                        </tr>))}</> : <tr>
                            <th colSpan={4} className='text-danger'> No Matches</th>
                        </tr>}

                    </tbody>
                </table>

                {selectedCustomer ? <>
                    <h3 className='text-center my-4 text-secondary'>Transactions for {selectedCustomer.name}</h3>
                    <TransactionChart transactions={filterByAmount.filter(transaction => transaction.customer_id == selectedCustomer.id)} />
                </>
                    : ''
                }

            </div>
        </div>
    </>
}








