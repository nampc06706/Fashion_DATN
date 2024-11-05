import React from 'react';

function DataIteration({ datas = [], startLength = 0, endLength = datas.length, children }) {
  // Kiểm tra kiểu dữ liệu của datas và endLength
  if (!Array.isArray(datas)) {
    console.error('Provided datas is not an array:', datas);
    return null;
  }

  // Đảm bảo endLength không vượt quá độ dài của mảng
  endLength = Math.min(endLength, datas.length);

  return (
    <>
      {datas.slice(startLength, endLength).map((value, index) => {
        if (!value || typeof value !== 'object' || !value.hasOwnProperty('id')) {
          console.error('Data item is not valid or does not have an id:', value);
          return null;
        }

        try {
          return (
            <React.Fragment key={value.id || index}>
              {children({ data: value, index })}
            </React.Fragment>
          );
        } catch (error) {
          //console.error('Error rendering children with data:', error);
          return null;
        }
      })}
    </>
  );
}

export default DataIteration;
