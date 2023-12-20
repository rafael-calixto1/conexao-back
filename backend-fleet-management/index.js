const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3030;
app.use(express.json());
app.use(cors());
//Funcao para ler os dados de 'db.funcionarios.json'


// Funcao para ler os dados de 'db.empresas.json'
function fetchDataCars() {
    try {
        const rawData = fs.readFileSync('db.cars.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Erro durante a leitura ou na analise dos dados das cars ', err);
        return { empresas: [] };
    }
}

// Funcao para salvar os dados de 'db.funcionarios.json'
function saveDataCars(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.cars.json', jsonData, 'utf8');
}


// Rota para obter uma lista com todos os funcionarios
// Rota para obter a lista de funcionarios
app.get('/api/cars', (req, res) => {
    try {
        const cars = fetchDataCars().cars;
        res.json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter a lista de carros.');
    }
});

  
// Rota para obter um carro especifico atraves do ID
app.get('/api/cars/:idCar', (req, res) => {
    const dados = fetchDataCars().cars;
    const id = req.params.idCar; // Corrected parameter name
    const car = dados.find(item => item.id === parseInt(id));
    if (car) {
        res.json(car);
    } else {
        res.status(404).send('Carro não encontrado');
    }
});

// Rota para adicionar um novo carro
app.post('/api/cars', express.json(), (req, res) => {
    try {
        const dados = fetchDataCars();
        const novoDado = {
            model: req.body.model,
            year: req.body.year,
            km: req.body.km !== undefined ? req.body.isMaintainceOk : 555,
            isMaintainceOk: req.body.isMaintainceOk !== undefined ? req.body.isMaintainceOk : false,
            isOilOk: req.body.isOilOk !== undefined ? req.body.isOilOk : false
        };

        const cars = dados.cars;

        // Find the maximum ID currently present in the data
        const maxId = cars.reduce((max, car) => (car.id > max ? car.id : max), 0);

        // Assign a new ID to the new car
        novoDado.id = maxId + 1;

        cars.push(novoDado);
        saveDataCars(dados);
        res.status(201).json(novoDado); // Car created successfully
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message); // Error creating a new car
    }
});



// Atualizar carros atraves de seu ID
app.put('/api/cars/:id', express.json(), (req, res) => {
    const dados = fetchDataCars();
    const id = req.params.id;
    const cars = dados.cars;
    const index = cars.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        cars[index] = req.body;
        saveDataCars(dados);
        res.json(cars[index]);
    } else {
        res.status(404).send('Carro não encontrado');
    }
});




// ligar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});