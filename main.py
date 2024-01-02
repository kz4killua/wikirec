from wikirec import wikirec


def main():

    # Define likes and dislikes
    likes = [
        "Silicon Valley (TV series)",
        "The Internship",
        "The Social Network",
        "Pirates of Silicon Valley",
        "The IT Crowd",
        "The Imitation Game",
    ]
    dislikes = [
        "Drug discovery",
    ]

    recommendations = wikirec(likes, dislikes, ['articles'], 5, 5)

    return recommendations


if __name__ == "__main__":
    main()