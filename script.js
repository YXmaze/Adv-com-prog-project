document.addEventListener('DOMContentLoaded', function() {
    const getDataBtn = document.getElementById('getDataBtn');
    getDataBtn.addEventListener('click', showData);
    alertcount = 0 
    let lineChartInstance = null;
    let columnChartInstance = null;
    supported_curr = ['AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR']
    
    
    
    
    
    async function showData() {

        // Remove old charts before displaying new ones
        if (supported_curr.includes(document.getElementById('baseCurrency').value.toUpperCase())&& supported_curr.includes(document.getElementById('targetCurrency').value.toUpperCase()) ){
            destroyChart('lineChart');
            destroyChart('columnChart');
            await displayLineChart();
            await displayColumnChart();
        }else{
            if (alertcount == 0){
                
                alert('Invalid Currency😡😡');
                alertcount += 1;

            } else {
                alertcount = 0;
            }
                 

        }


    }
    ///// for the line chart
    function getDate(past){
        const currentDate = new Date();
        const lastYearDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()- past
        );
        
        const year = lastYearDate.getFullYear();
        const month = (lastYearDate.getMonth() + 1).toString().padStart(2, '0');
        const day = lastYearDate.getDate().toString().padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;

    }

    function destroyChart(chartId) {
        const existingChart = window.chartInstances[chartId];
        if (existingChart) {
            existingChart.destroy();
            delete window.chartInstances[chartId];
        }

        const canvas = document.getElementById(chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Object to store chart instances
    window.chartInstances = {};

    async function displayLineChart() {
        destroyChart('lineChart');
        const lineChartContainer = document.querySelector('.chart-container:nth-child(1)');
        


        /////Automatically convert input currency to upper to match data from APIs
        baseCurrency = document.getElementById('baseCurrency').value.toUpperCase();
        targetCurrency = document.getElementById('targetCurrency').value.toUpperCase();


        ///////START OF CODE that can be removed if it is proved to be useless

        ///use to provide default for debugging and demonstration
        //if (baseCurrency ==""){
            //console.log("default currency is selected as base currency: THB")
            //baseCurrency = "THB"
        //}

        

        //if (targetCurrency ==""){
            //console.log("default currency is selected as target currency: THB")
            //targetCurrency = "THB"
        //}

        ////// END OF REMOVEABLE code


        const dataset = {};

        for(let i = 3; i > 0; i--) {
            const datea = getDate(i);
            try {
                const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_4BnSpIkrfxjcB5YD42qHeIKVIczal4wid9K26qF0&date=${datea}&base_currency=${baseCurrency}`);
                if (!response.ok) {
                    //#alert("Too many requests");
                    throw new Error('Too many requests');
                }
                const data = await response.json();
                dataset[datea] = parseFloat(data.data[datea][targetCurrency]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        //graph

        //console.log("End");
        //console.log(Object.keys(dataset));
        const ctx = document.getElementById('lineChart').getContext('2d');
        window.chartInstances['lineChart'] =  new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(dataset),
                datasets: [{
                    label: `${targetCurrency}`,
                    data: Object.values(dataset),
                    borderColor: '#4E8EE0',
                    fill: false
                }]
            }
        });
    }
    //// for the column chart 
    async function displayColumnChart() {
        destroyChart('columnChart');

        const resvcurs = new Set(["USD","EUR","GBP","CNY"]); //jpy thesedays too strong it's hard to read the chart so eleminate it and replace bt No.5 which is CNY
        resvcurs.add(targetCurrency); // take it as a set to prevent duplicates
        const resvcur = Array.from(resvcurs); //convert to array for easier access
        const dataset = {};



        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_4BnSpIkrfxjcB5YD42qHeIKVIczal4wid9K26qF0&base_currency=${baseCurrency}`);
        if (!response.ok) {
            //#alert("Too many requests");
            throw new Error(response.errors);
            
        }
        const data = await response.json();
        console.log(Object.keys(data.data));
        for(let i = 0; i <resvcurs.size; i++) {
            console.log(resvcur[i]);
            dataset[resvcur[i]]= data.data[resvcur[i]];




        }
        /////graph 
        console.log(dataset);
        const ctx = document.getElementById('columnChart').getContext('2d');
        window.chartInstances['columnChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dataset),
                datasets: [{
                    label: `Exchange Rates`,
                    data: Object.values(dataset),
                    backgroundColor: '#87ceeb',
                    borderColor: '#4e8ee0',
                    borderWidth: 1
                }]
            }
        });
    }
})