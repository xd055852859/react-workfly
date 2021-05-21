import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

// fake data generator const getItems = (count, offset = 0) => Array.from({
// length: count }, (v, k) => k).map(k => ({     id: `item-${k + offset}`,
// content: `item ${k + offset}` })); a little function to help us with
// reordering the result


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging
        ? 'lightgreen'
        : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver
        ? 'lightblue'
        : 'lightgrey',
    padding: grid,
    width: 250
});

class Test extends Component {
    // state = {     items: getItems(10),     selected: getItems(5, 10) };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    getList = id => this.props.taskInfo[id];

    onDragEnd = result => {
        const {source, destination} = result;
        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            const items = reorder(this.getList(source.droppableId), source.index, destination.index);
        } else {
            const result = move(this.getList(source.droppableId, source.index), this.getList(destination.droppableId, destination.index), source, destination);
            this.props.taskInfo[source.droppableId] = result.droppable;
            this.props.taskInfo[destination.droppableId] = result.droppable2;
            // this.setState({items: result.droppable, selected: result.droppable2});
        }
    };

    // Normally you would want to split things out into separate components. But in
    // this example everything is just done in one place for simplicity
    render() {

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.props.taskInfo.map((taskInfoitem, taskInfoindex) => {
                    return (
                        <Droppable droppableId={taskInfoindex} key={'taskinfo' + taskInfoindex}>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                    {taskInfoitem.map((item, index) => (
                                        <Draggable key={item._key} draggableId={item._key} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                    {item.title}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )
                })}
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!
export default Test
