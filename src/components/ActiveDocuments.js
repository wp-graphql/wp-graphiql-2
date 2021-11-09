import { Tabs } from 'antd'
import GraphiQLContainer from './GraphiQLContainer';
import styled from 'styled-components'
const { useAppContext } = window.wpGraphiQL;
const { useState, useEffect } = wp.element;


const { TabPane } = Tabs

const StyledTabContainer = styled.div`
> .ant-tabs {
    height: 100%;
    width: '100%';
    .ant-tabs-tabpane, .ant-tabs-content {
        height: 100%;
    }
}
`

const ActiveDocuments = props => {

    const { nonce, endpoint } = props
    const { schema } = useAppContext()
    const [ graphiqlHeight, setGraphiqlHeight ] = useState(500)
    const getInitialPanes = () => {
        return [
            {
                key: '1',
                title: 'Get Posts',
                type: 'query',
                content: (<h2>Get Posts...</h2>)
            },
            {
                key: '2',
                title: 'Get Users',
                type: 'query',
                content: (<h2>Get Users...</h2>)
            }
        ]
    }

    const initialPanes = getInitialPanes()

    const [ panes, setPanes ] = useState( initialPanes )
    const [ activeKey, setActiveKey ] = useState( initialPanes[0].key )

    // Change tabs
    const handleChangeTabs = newActiveKey => {

        console.log( {
            newActivePane: panes.find( pane => pane.key === newActiveKey ),
        }) 

        setActiveKey( newActiveKey )
    }

    const addTab = () => {

        console.log( `add tab!` )

        const activeKey = panes[panes.length - 1].key + 1
        const newPanes = [...panes]

        const newPane = {
            key: activeKey,
            title: 'untitled document',
            content: (<h2>New Query!</h2>)
        }

        

        newPanes.push(newPane)
        
        console.log( { addTab: {
            panes,
            newPane,
            newPanes,
        }})

        setPanes( newPanes )
        setActiveKey( activeKey )

    }

    const removeTab = key => { 
        let newActiveKey = activeKey 
        let lastIndex
        panes.forEach( ( pane, index ) => {
            if ( pane.key === key ) {
                lastIndex = index
            }
        })
        const newPanes = panes.filter( pane => pane.key !== key);
        if ( newPanes.length && newActiveKey === key ) {
            if ( lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key
            } else {
                newActiveKey = newPanes[0].key
            }
        }
        setPanes(newPanes)
        setActiveKey(newActiveKey)
    }

    const edit = key => {
        console.log( 'edit tab...' )
    }

    // Edit the tabs
    const handleEdit = ( targetKey, action ) => {

        console.log( {
            handleEdit: { 
                targetKey,
                action
            }
        })

        switch( action ) {
            case 'add':
                addTab()
                break
            case 'remove':
                removeTab(targetKey)
                break
            case 'edit':
                editTab(targetKey)
                break
            default:
                console.log( `${action} is not a function`)
        }

        // [action](targetKey)
    }

    /**
 * Handle the resize of the App when the window size changes
 */
const handleResize = () => {
    // Hide update nags and errors on the graphiql page
    // document.getElementsByClassName('update-nag' )[0].style.visibility = 'hidden';
    // document.getElementsByClassName('error' )[0].style.visibility = 'hidden';
  
    let defaultHeight = 500;
    let windowHeight = window.innerHeight;
    let footerHeight = document.getElementById("wpfooter").clientHeight ?? 60;
    let adminBarHeight = document.getElementById("wpadminbar").clientHeight ?? 60;
    let height = windowHeight - adminBarHeight - footerHeight - 65;
    let graphqlHeight = height < defaultHeight ? defaultHeight : height;
  
    let wrapWidth = document.querySelector('#wpbody .wrap').clientWidth ?? 500;

    document.getElementById("graphiql").style.height = graphqlHeight + "px";
    document.getElementById("graphiql").style.width = wrapWidth + "px";

    let documentTabs = document.getElementById("graphiql-active-documents-tabs")

    documentTabs.style.height = `${graphqlHeight}px`;
    documentTabs.style.width = `${wrapWidth}px`;

    setGraphiqlHeight( graphqlHeight - 60 )

  };

  useEffect(() => {
      // Listen for resizes to keep the app sized for the window
    handleResize();
    window.addEventListener("resize", handleResize);
  })
    
    return (
        <StyledTabContainer id="graphiql-active-documents-tabs" className="antd-app" >
            <Tabs
                type="editable-card"
                onChange={handleChangeTabs}
                activeKey={activeKey}
                onEdit={handleEdit}
            >
                {panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closable={true}>
                        <GraphiQLContainer height={graphiqlHeight} />
                    </TabPane>
                ))}
            </Tabs>
        </StyledTabContainer>
    )

}

export default ActiveDocuments