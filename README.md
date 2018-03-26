# Vivacious-ants

> The repository and the code examples comes as a support for the [Solving microservices shell hell with fuge](https://www.alxolr.com/articles/solving-microservices-shell-hell-with-fuge).

For this tutorial you will need docker and mongo image and node 8.x.

## Installation

* Install [fuge.io](http://fuge.io/)

```bash
 npm install -g fuge
```

* Go to `vivacious-ants` directory and start the fuge shell.

```bash
fuge shell fuge.yml

fuge start all
```

* After running:

```bash
ps
```

You should get something like:

```bash
name                          type           status         watch          tail
antscounter                   node           running        yes            yes
analytics                     node           running        yes            yes
app                           node           running        yes            yes
mongo                         container      not managed
```

## Usage

* Ants home page http://localhost:3000/ants
* Ants analytics http://localhost:3000/analytics