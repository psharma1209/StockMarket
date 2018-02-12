angular
  .module("stockMarketApp", [])
  .controller("stockMarketController", function($scope) {
    // Variable declaration
    var self = this;
    self.stockMarketList = [];
    var stockNamesList = [];
    var removeIndex = -1;

    // websocket connection
    var connection = new WebSocket("ws://stocks.mnet.website", "wamp");

    connection.onopen = function() {
      console.log("connection opened");
    };

    connection.onmessage = function(e) {
      handleUpdateMessage(JSON.parse(e.data));
    };

    connection.onclose = function() {
      console.log("connection closed");
    };

    connection.onerror = function() {
      console.log("connection closed");
    };

    // handler function
    function handleUpdateMessage(data) {
      if (self.stockMarketList.length === 0) {
        self.stockMarketList = data;
        stockList = self.stockMarketList.map(([name, value]) => name);
      } else {
        data.forEach(([name, price], i) => {
          var ind = stockList.indexOf(name);
          if (ind > -1) {
            // update existing stock
            if (self.stockMarketList[ind].length === 2) {
              self.stockMarketList[ind].push(self.stockMarketList[ind][1]);
              self.stockMarketList[ind].push(new Date());
              if (self.stockMarketList[ind][1] > price) {
                self.stockMarketList[ind].push("red");
              } else {
                self.stockMarketList[ind].push("green");
              }
            } else {
              self.stockMarketList[ind][2] = self.stockMarketList[ind][1];
              self.stockMarketList[ind][3] = new Date();
              if (self.stockMarketList[ind][1] > price) {
                self.stockMarketList[ind][4] = "red";
              } else {
                self.stockMarketList[ind][4] = "green";
              }
            }

            self.stockMarketList[ind][1] = price;
          } else {
            self.stockMarketList.push([
              name,
              price,
              price,
              new Date(),
              "black"
            ]);
            stockList.push(name);
          }
        });
      }
      $scope.$apply();
      // console.log(self.stockMarketList);
    }
  });
