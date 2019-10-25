import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { createAppContainer } from 'react-navigation';
import AppIntroSlider from 'react-native-app-intro-slider'

import SLIDERS from '../helpers/slidersHelper'
import { INTRO_SLIDES } from '../helpers/constantsHelper'
import rootNavigation from '../navigations/rootNavigation'
import { getStorageItem, setStorageItem } from '../helpers/functionsHelper'

const Root = ({ user }) => {
    const [shouldSlide, setShouldSlide] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Manage intro sliders render
        if(!shouldRender){
            getStorageItem(INTRO_SLIDES).then(
                (data) => {
                    data = JSON.parse(data);
                    if(data != null) setShouldSlide(data);
                    else setShouldSlide(true);

                    setShouldRender(true);
                }
            ).catch((error) => console.log(`Something when wrong ${error}`));
        }
    }, []);

    // Complete action (sliders)
    const slidersComplete = () => {
        setStorageItem(INTRO_SLIDES, false).then(
            () => {
                setShouldSlide(false);
            }
        ).catch((error) => console.log(`Something when wrong ${error}`));
    };

    // Render
    if(shouldRender) {
        if(shouldSlide) {
            return(
                <AppIntroSlider slides={SLIDERS}
                    showSkipButton={true}
                    onDone={() => slidersComplete()}
                    onSkip={() => slidersComplete()}
                />
            );
        } else {
            const Navigation = createAppContainer(rootNavigation(user.auth));
            return(<Navigation />);
        }
    } else {
        return null;
    }
};

Root.propTypes = {
    user: PropTypes.object.isRequired
};

// Map dispatch function to component props
const mapDispatchToProps = (dispatch) => ({
    dispatch: (action) => { dispatch(action)}
});

// Map state function to component props
const mapStateToProps = (state) => ({
    user: state.user
});

// Connect React to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Root);