(function(){
    const $ = q => document.querySelector(q);

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function renderGarage() {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c));
    };

    function addCarToGarage(car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.proprietario}</td>
            <td>${car.modelo} - ${car.cor}</td>
            <td>${car.placa}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        $("#garage").appendChild(row);
    };

    function checkOut(info) {
        let period = new Date() - new Date(info[3].dataset.time);
        period = convertPeriod(period);

        const placa = info[2].textContent;
        const msg = `O veículo ${info[1].textContent} de placa ${placa} permaneceu ${period} estacionado. \n\n Deseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter(c => c.placa !== placa);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
    };

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const proprietario = $("#proprietario").value;
        const placa = $("#placa").value;
        const apartamento = $("#apartamento").value;
        const bloco = $("#bloco").value;
        const modelo = $("#modelo").value;
        const cor = $("#cor").value;
        const numeroVaga = $("#numero-vaga").value;

        if (!proprietario || !placa || !modelo || !cor || !numeroVaga) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        const car = {
            proprietario,
            placa,
            apartamento,
            bloco,
            modelo,
            cor,
            numeroVaga,
            time: new Date()
        };

        const garage = getGarage();
        garage.push(car);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(car);
        $("#proprietario").value = "";
        $("#placa").value = "";
        $("#apartamento").value = "";
        $("#bloco").value = "";
        $("#modelo").value = "";
        $("#cor").value = "";
        $("#numero-vaga").value = "";
    });

    $("#garage").addEventListener("click", (e) => {
        if (e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });
})();
