import React from 'react'

const preventDrag = function(e) {
  e.stopPropagation()
  e.preventDefault()
}

const Dropzone = ({children, dragEnter, dragLeave, drop}) => {

  var drags = 0

  return (
    <div
      onDragOver={e => {
        preventDrag(e)
      }}
      onDragEnter={e => {
        preventDrag(e)
        if (drags === 0) {
          dragEnter()
        }
        drags++
      }}
      onDragLeave={e => {
        preventDrag(e)
        drags--
        if (drags === 0) {
          dragLeave()
        }
      }}
      onDrop={e => {
        preventDrag(e)
        drop(e.dataTransfer.files)
      }}
    >
      {children}
    </div>
  )
}

export default Dropzone
