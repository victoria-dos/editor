import React from "react";

import useHandle from '../../dnd/use-handle';
import useState from '../../dnd/use-state';
import useContainer from "../../dnd/use-container";

export interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
    id?: string;
    container?: string;
    isRoot?: boolean;
    HandleProps?: React.HTMLProps<HTMLDivElement>;
    ListProps?: React.HTMLProps<HTMLDivElement>;
    Component: React.FC<{ id: string; container: string; }>;
    Handle?: string | React.FC;
}

const Container: React.FC<ContainerProps> = ({ id, container: sourceContainer, isRoot, Handle = 'div', HandleProps, ListProps, Component, ...props }) => {
    const state = useState();

    const { ref, container, id: containerId } = useContainer({ id, isRoot })
    const events = useHandle({ component: containerId, sourceContainer, isContainer: true })

    return <div ref={ref} {...props}>
        <div {...ListProps}>
            {container.children.map((key: string) => {
                if (!state.components[key]) {
                    return <Container
                        key={key}
                        id={key}
                        container={containerId}
                        Component={Component}
                        HandleProps={HandleProps}
                        ListProps={ListProps}
                        Handle={Handle}
                        {...props}
                    />
                }
                return <Component key={key} id={key} container={containerId} />
            })}
        </div>
        {sourceContainer && <Handle
            {...HandleProps}
            {...events}
        />}
    </div>
}

export default Container;