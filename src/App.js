import "./App.css";
import axios from "axios";
import Header from "./Components/Header/Header";
import Monitor from "./Components/Monitor/Monitor";
import Table from "./Components/Table/Table";

import { useEffect, useState } from "react";

function App() {
  // оъбявляем стейт
  const [id, setDataId] = useState();
  const [rows, setRows] = useState([]);
  // стягиваем данные с ЛС
  const idFromLS = localStorage.getItem("id");

  // эффект создания сущности, если нету
  useEffect(() => {
    loadItemIfNeeded();
  }, []);

  // заводим эффект загрузки данных по строке
  useEffect(() => {
    loadRows();
  }, [id]); // эффект должен перезапрашивать список на изменение ид

  // заводим функцию загрузки сущности
  const loadItemIfNeeded = async () => {
    // если ид есть, просто стеим его в стейт
    if (!!idFromLS) {
      setDataId(idFromLS);
    } else {
      // если нет, запрашиваем и сетим
      await axios
        .post("http://185.244.172.108:8081/v1/outlay-rows/entity/create")
        .then((res) => {
          // в стор
          localStorage.setItem("id", res.data.id);
          // в стейт
          setDataId(res.data.id);
          // console.log(res.data)
        })
        .catch((err) => console.log(err));
    }
  };

  // функция загрузки списка строк
  const loadRows = () => {
    console.log(id);
    if (id) {
      axios
        .get(`http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/list`)
        .then((response) => {
          // сетим данные в сетйт
          setRows(response.data);
          // console.log(response)
        });
    }
  };

  const deleteData = async ({ parentId }) => {
    if (id) { await
      axios
        .delete(`http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/${parentId}/delete`)
        .then((response) => {
          // сетим данные в сетйт
          setRows(response.data);
          // console.log(response)
        });
    }
  };

  // const deleteData = async ({id, parentId, rows}) => {
  //   try {
  //      const response = await axios
  //      .delete(`http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/${parentId}/delete`);
  //      console.log(response.data);
  //   } catch (error) {
  //      console.error(error);
  //   }
  // };


  // функция сохранения новой строки
  const setRow = (newRowData) => {
    axios
      .post(
        `http://185.244.172.108:8081/v1/outlay-rows/entity/${id}/row/create/`,
        newRowData
      )
      .then((response) => {
        // обновляем локальный список строк без лишнего запроса

        // тут будет сложно, но это ключевая часть приложения

        // объявляем фукнцию, которая будет искать в дереве строка путь до нужного узла
        const rowUpdater = (rows, path) => {
          // rows - часть дерева строк
          // changes - путь до целевого узла

          // пока в пути есть шаги
          if (path.length > 0) {
            // вызываем эту же самую функицю для следующего уровня дерева строк и сокращаем путь на 1 шаг
            rowUpdater(
              rows.find((row) => row.id === path[path.length - 1].id).child,
              path.slice(0, path.length - 1)
            );
          } else {
            // если путь закончился, то у тебя в ссылка на нужный тебе массив, в который можноскладывать строку
            // не забывая предусмотреть ей поле для вложенных строк
            rows.push({ ...response.data.current, child: [] });
          }
        };

        // функция rowUpdater рекурсивная и использует замыкание
        // она позволяет обновить локальное дерево строк любого уровня вложенности,
        // при условии что массив чендж будет иметь путь до узла, в котором появился новая строка
        const newRows = [...rows];
        // используем нашу функцию
        rowUpdater(newRows, response.data.changed);

        // роуАпдейтер мутировал массив ньюроутс, теперь его нужно засетить в стейт
        setRows(newRows);
      });
  };




  // мок строки, по идее это длжно заполняться в инерфейсе
  const rowData = {
    equipmentCosts: 1,
    estimatedProfit: 2,
    machineOperatorSalary: 3,
    mainCosts: 4,
    materials: 5,
    mimExploitation: 6,
    overheads: 7,
    // вот это поле должно ссылаться на родителя или быть null
    parentId: null,
    // а вот это вроде похуй какое
    rowName: "Строка",
    salary: 6,
    supportCosts: 5,
  };

  return (
    <div className="app">
      <Header />
      <Monitor />
      {/* тестовая кнопка, которая создает одинаковый роу первого уровня из мока */}
      <button onClick={() => setRow(rowData)}>Создать строку</button>
      <button onClick={() => deleteData()}>Удалить</button>
      {/* пробрасываем в тейбл актуальный список строк */}
      <Table 
        list={rows} 
        setRow={setRow}
        deleteData={deleteData}/>
    </div>
  );
}

export default App;
