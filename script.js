document.addEventListener('DOMContentLoaded', function() {
    const getDataBtn = document.getElementById('getDataBtn');
    getDataBtn.addEventListener('click', showData);

    function showData() {
        displayLineChart();
        displayColumnChart();
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

    async function displayLineChart() {

        /////Automatically convert input currency to upper to match data from APIs
        baseCurrency = document.getElementById('baseCurrency').value.toUpperCase();



        ///////START OF CODE that can be removed if it is proved to be useless

        ///use to provide default for debugging and demonstration
        if (baseCurrency ==""){
            console.log("default currency is selected as base currency: THB")
            baseCurrency = "THB"
        }

        targetCurrency = document.getElementById('targetCurrency').value.toUpperCase();

        if (targetCurrency ==""){
            console.log("default currency is selected as target currency: THB")
            targetCurrency = "THB"
        }

        ////// END OF REMOVEABLE code


        const dataset = {};

        for(let i = 1; i < 4; i++) {
            const datea = getDate(i);
            try {
                const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_4BnSpIkrfxjcB5YD42qHeIKVIczal4wid9K26qF0&date=${datea}&base_currency=${baseCurrency}`);
                if (!response.ok) {
                    throw new Error('Error');
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
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(dataset),
                datasets: [{
                    label: `${targetCurrency}`,
                    data: Object.values(dataset),
                    borderColor: 'blue',
                    fill: false
                }]
            }
        });
    }
    //// for the column chart 
    async function displayColumnChart() {

        const resvcurs = new Set(["USD","CHF","GBP","EUR"]); //usa japan british europe from https://www.bing.com/ck/a?!&&p=9f6ff67bc87c2739JmltdHM9MTcxMzMxMjAwMCZpZ3VpZD0yMjg2MjI0NC00YWQ5LTYxN2YtMzdkNy0zNjU5NGIwMzYwZmImaW5zaWQ9NTIyNA&ptn=3&ver=2&hsh=3&fclid=22862244-4ad9-617f-37d7-36594b0360fb&psq=five+most+used+currecny&u=a1aHR0cHM6Ly9meHNzaS5jb20vdG9wLTUtbW9zdC10cmFkZWQtY3VycmVuY2llcy1pbi10aGUtd29ybGQ&ntb=1
        resvcurs.add(targetCurrency); // take it as a set to prevent duplicates
        const resvcur = Array.from(resvcurs); //convert to array for easier access
        const dataset = {};



        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_4BnSpIkrfxjcB5YD42qHeIKVIczal4wid9K26qF0&base_currency=${baseCurrency}`);
        if (!response.ok) {
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
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dataset),
                datasets: [{
                    label: `Exchange Rates`,
                    data: Object.values(dataset),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            }
        });
    }
})