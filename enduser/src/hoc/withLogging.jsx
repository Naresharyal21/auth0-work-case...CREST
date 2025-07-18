const withLogging = (Component) => () => {
    console.log('Rendering component:', Component.name);

    return <Component />
}

export default withLogging;