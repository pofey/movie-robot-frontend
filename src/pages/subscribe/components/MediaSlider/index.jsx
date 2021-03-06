import React from 'react';
import styled from "styled-components/macro";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Slider from '../Slider';
import TitleCard from '../TitleCard';
import PersonCard from '../PersonCard';
import RatingLabel from "@/pages/subscribe/components/RatingLabel";

const   MediaSlider = ({
                         sliderKey,
                         title,
                         isLoading,
                         titles,
                         linkUrl
                     }) => {
    const finalTitles = titles.slice(0, 20).map((title) => {
        // eslint-disable-next-line default-case
        switch (title?.type?.toUpperCase()) {
            case 'MOVIE':
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        subject={<RatingLabel rating={title?.rating}/>}
                    />
                );
            case 'TV':
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        subject={<RatingLabel rating={title?.rating}/>}
                    />
                );
            case 'PERSON':
                return (
                    <PersonCard
                        personId={title.id}
                        name={title.name}
                        profilePath={title.profilePath}
                    />
                );
            default:
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        subject={<RatingLabel rating={title?.rating}/>}
                    />
                );
        }
    });

    return (
        <>
            <SliderHeader>
                {
                    linkUrl
                        ? <LinkWrapper href={linkUrl}>
                            <span>{title}</span>
                            <ArrowForwardIcon style={{marginLeft: '8px'}}/>
                        </LinkWrapper>
                        : <LinkWrapper>
                            <span>{title}</span>
                        </LinkWrapper>
                }
            </SliderHeader>
            <Slider
                sliderKey={sliderKey}
                isLoading={isLoading}
                isEmpty={false}
                items={finalTitles}
            />
        </>
    );
}

export default MediaSlider;


const SliderHeader = styled.div`
  position: relative;
  margin-top: 6px;
  margin-bottom: 16px;
  display: flex;
`;

const LinkWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  text-decoration: inherit;
  @media (min-width: 640px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24px;
    line-height: 32px;
    line-height: 36px;
  }

`