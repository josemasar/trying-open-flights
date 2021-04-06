import React, { useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Header from './Header'
import styled from 'styled-components'
import ReviewForm from './ReviewForm'

const Wrapper = styled.div`
    margin-left: auto;
    margin-right: auto;
`

const Column = styled.div`
    background: #fff; 
    max-width: 50%;
    width: 50%;
    float: left; 
    height: 100vh;
    overflow-x: scroll;
    overflow-y: scroll; 
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    &:last-child {
        background: black;
        border-top: 1px solid rgba(255,255,255,0.5);
    }
`

const Main = styled.div`
    padding-left: 50px;
`


const Airline = (props) =>{

    const [airline, setAirline] = useState({})
    const [reviews, setReviews] = useState([])
    const [review, setReview] = useState({ title: '', description: '', score: 0 })
    const [loaded, setLoaded] = useState(false)

    useEffect( () => {
        const slug = props.match.params.slug
        const url = `/api/v1/airlines/${slug}`

        axios.get(url)
        .then( resp => {
            setAirline(resp.data)
            setReviews(resp.data.included)
            setLoaded(true)
        })
        .catch( resp => console.log (resp))
        
    }, [])

    const handleChange = (e) => {
        setReview(Object.assign({}, review, {[e.target.name]: e.target.value}))
      }
    
    const handleSubmit = (e) => {
        e.preventDefault()

        const csrfToken = document.querySelector('[name=csrf-token]').content
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

        const airline_id = parseInt(airline.data.id)
        axios.post('/api/v1/reviews', {...review, airline_id})
        .then( resp => {
            setReviews([...reviews, resp.data.data])
            setReview({ title: '', description: '', score: 0 })
        })
        .catch( resp => {})
    }

    const setRating = (score, e) => {
        e.preventDefault()
        setReview({...review, score})
    }

    return(
        <Wrapper>
        { loaded && 
        <Fragment>
            <Column>
                <Main>
                <Header
                attributes={airline.data.attributes}
                reviews={airline.included}
                />
                <div className="reviews"></div> 
                </Main>
            </Column>
            <Column>
                <ReviewForm
                name={airline.data.attributes.name}
                review={review}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setRating={setRating}
                />
            </Column>
        </Fragment>
        }
        </Wrapper>
    )
}

export default Airline;