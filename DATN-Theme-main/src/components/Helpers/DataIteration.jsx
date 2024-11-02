import React from 'react';

function DataIteration({ datas = [], startLength = 0, endLength, children }) {

  // Kiểm tra kiểu dữ liệu của datas
  if (!Array.isArray(datas)) {
    console.error('Dữ liệu được cung cấp không phải là một mảng:', datas);
    return null;
  }

  const computedEndLength = endLength !== undefined ? Math.min(endLength, datas.length) : datas.length;
  const slicedData = datas.slice(startLength, computedEndLength);

  return (
    <>
      {slicedData.map((value, index) => {
        if (!value || typeof value !== 'object' || !value.hasOwnProperty('id')) {
          console.error('Mục dữ liệu không hợp lệ hoặc không có id:', value);
          return null;
        }

        try {
          return (
            <React.Fragment key={value.id || index}>
              {children({ data: value, index })}
            </React.Fragment>
          );
        } catch (error) {
          //console.error('Lỗi khi render children với dữ liệu:', error);
          return null;
        }
      })}
    </>
  );
}

export default DataIteration;
