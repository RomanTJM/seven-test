import React from 'react';
// import Row from "./Components/Row/Row";

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

export default function Table({ list, setRow, deleteData }) {
  if (!list) {
    return <>хуй</>;
  }
  return (
    <ul>
      {list &&
        list.map((item) => <Row key={item.id} setRow={setRow} row={item} deleteData={deleteData}/>)}
    </ul>
  );
}

export function Row({ row, setRow, deleteData }) {
  return (
    <li>
      {row.rowName}-{row.id}
      <button onClick={() => setRow({ ...rowData, parentId: row.id })}>
        создать подстроку
      </button>
      <button onClick={() => deleteData({...rowData, parentId: row.id})}>
        удалить
      </button>
      {row.child?.map((item) => (
        <ul key={item.id}>
          <Row setRow={setRow} row={item} />
        </ul>
      ))}
    </li>
  );
}
