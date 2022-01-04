import { useReducer } from "react";

const clearDrag = {
    draggingElement: null,
    isDraggingContainer: null,
    draggingSourceContainer: null,
}

const reducer = (state: any, action: any) => {
    console.log(action.type, action, state)
    switch (action.type) {
        case 'DRAG_START':
            return {
                ...state,
                draggingElement: action.component,
                isDraggingContainer: action.isContainer,
                sourceContainer: action.sourceContainer,
            };
        case 'DRAG_DROP':
            // dragging outside container
            if (!action.targetContainer) {
                return {
                    ...state,
                    ...clearDrag,
                }
            }

            // dragging container into itself
            if (state.isDraggingContainer && state.draggingElement === action.targetContainer) {
                return {
                    ...state,
                    ...clearDrag,
                }
            }

            // dragging container into sub-container
            if (state.isDraggingContainer) {
                let parentContainer = Object.keys(state.containers).find(key => state.containers[key].children.includes(action.targetContainer));

                // check all parent containers
                while (parentContainer && parentContainer !== 'root' && parentContainer !== state.draggingElement) {
                    // eslint-disable-next-line no-loop-func
                    parentContainer = Object.keys(state.containers).find(key => state.containers[key].children.includes(parentContainer));
                    console.log('parent', parentContainer)
                }

                if (parentContainer === state.draggingElement) {
                    return {
                        ...state,
                        ...clearDrag,
                    }
                }
            }

            // is moving to the same position
            if (state.sourceContainer
                &&
                state.sourceContainer === action.targetContainer
                // is being moved to the same position or after the position
                && (
                    state.containers[state.sourceContainer].children.indexOf(state.draggingElement) === action.position ||
                    state.containers[state.sourceContainer].children.indexOf(state.draggingElement) + 1 === action.position
                )
            ) {
                return {
                    ...state,
                    ...clearDrag,
                }
            }

            // generate id for new items or used the old one
            const id = state.sourceContainer ? state.draggingElement : `${state.draggingElement}-${Date.now()}`;

            // remove item from the old container, or create a new one
            if (state.sourceContainer) {
                state.containers[state.sourceContainer].children = state.containers[state.sourceContainer].children.filter((child: string) => child !== id);
            }

            // push to the exact position
            // when position is not specified, push to the bottom
            if (typeof action.position === 'undefined') {
                state.containers[action.targetContainer].children.push(id)
            } else {
                state.containers[action.targetContainer].children.splice(action.position, 0, id)
            }

            // moving existing node
            if (state.sourceContainer) {
                return {
                    ...state,
                    ...clearDrag,
                }
                // inserting a new node
            } else {
                // if dragging container add a container
                if (state.isDraggingContainer) {
                    return {
                        ...state,
                        ...clearDrag,
                        ...(action.targetContainer && {
                            containers: {
                                ...state.containers,
                                [id]: {
                                    children: [],
                                    ref: null,
                                }
                            },
                        })
                    };
                }
                // if dragging component add a component
                return {
                    ...state,
                    ...clearDrag,
                    ...(action.targetContainer && {
                        components: {
                            ...state.components,
                            [id]: {
                                component: state.draggingElement,
                                name: id
                            }
                        },
                    })
                };
            }
        case 'UPDATE_CONTAINER':
            state.containers[action.id].ref = action.ref;

            return state;
        case 'UPDATE_COMPONENT':
            state.components[action.id].ref = action.ref;

            return state;
    }
}

function useBuilderState(): [any, any] {
    const [state, dispatch] = useReducer(reducer, null, () => {
        return {
            ...clearDrag,
            components: {},
            containers: {
                root: {
                    children: [],
                    ref: null
                }
            }
        };
    });

    return [state, dispatch];
}

export default useBuilderState;