# COPY
COPY has two forms. The latter form is required for paths containing whitespace.

```
COPY [OPTIONS] <src> ... <dest>
COPY [OPTIONS] ["<src>", ... "<dest>"]
```

### Option
--from
--chown
--chmod
--link
--parents
--exclude

## Source

Copy two files, `file1.txt` and `file2.txt`, from the build context to
`/usr/src/things/` in the build container:

```
COPY file1.txt file2.txt /usr/src/things/
```

### COPY --from

By default, the COPY instruction copies files from the build context. The COPY
`--from` flag lets you copy files from an image, a build stage, or a named context
instead.


```
COPY [--from=<image|stage|context>] <src> ... <dest>
```

```
COPY --from=build /hello /
```

## COPY --chown --chmod

```
COPY [--chown=<user>:<group>] [--chmod=<perms> ...] <src> ... <dest>
```

The following examples show valid definitions for the `--chown` flag

```
COPY --chown=55:mygroup files* /somedir/
COPY --chown=bin files* /somedir/
COPY --chown=1 files* /somedir/
COPY --chown=10:11 files* /somedir/
COPY --chown=myuser:mygroup --chmod=644 files* /somedir/
```

The `--chmod` flag supports variable interpolation, which lets you define the
permission bits using build arguments


```
COPY --chmod=${PERMS} files* /somedir/
```

## COPY --link

```
COPY [--link[=<boolean>]] <src> ... <dest>
```

```
COPY --link /foo /bar
```


## COPY --parents

The --parents flag preserves parent directories for src entries. This flag
defaults to false.

```
COPY [--parents[=<boolean>]] <src> ... <dest>
```

```
COPY --parents ./x/a.txt ./y/a.txt /parents/
```

### COPY --exclude

```
COPY [--exclude=<path> ...] <src> ... <dest>
```

```
COPY --exclude=*.txt hom* /mydir/
COPY --exclude=*.txt --exclude=*.md hom* /mydir/
```
