// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace
namespace DDInterfaces {
  export interface IDraggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  export interface IDragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}
