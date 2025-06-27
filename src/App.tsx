import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationForm from './components/QuotationForm';

const App: React.FC = () => {
    return (
        <div className="container mt-5">
            <QuotationForm />
        </div>
    );
};

export default App;